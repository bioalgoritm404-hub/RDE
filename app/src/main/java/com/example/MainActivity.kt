package com.example

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.provider.MediaStore
import android.webkit.JavascriptInterface
import android.webkit.JsPromptResult
import android.webkit.JsResult
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.EditText
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.VsCodeDarkBg
import java.io.File

class MainActivity : ComponentActivity() {

    var currentWebView: WebView? = null
    var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    var currentWorkspaceUri: Uri? = null
    var pendingSaveContent: String? = null

    val fileChooserLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val data = result.data
            val uris = WebChromeClient.FileChooserParams.parseResult(result.resultCode, data)
            fileChooserCallback?.onReceiveValue(uris)
        } else {
            fileChooserCallback?.onReceiveValue(null)
        }
        fileChooserCallback = null
    }

    val openDirectoryLauncher = registerForActivityResult(ActivityResultContracts.OpenDocumentTree()) { uri ->
        if (uri != null) {
            try {
                contentResolver.takePersistableUriPermission(
                    uri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                )
            } catch (_: Exception) {}
            loadDirectoryTree(uri)
        }
    }

    val saveDocumentLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val uri = result.data?.data
            val dataToWrite = pendingSaveContent
            if (uri != null && dataToWrite != null) {
                try {
                    contentResolver.openOutputStream(uri, "wt")?.use { out ->
                        out.write(dataToWrite.toByteArray(Charsets.UTF_8))
                        out.flush()
                    }
                    Toast.makeText(this, "Saved successfully!", Toast.LENGTH_SHORT).show()
                } catch (e: Exception) {
                    Toast.makeText(this, "Save error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
        pendingSaveContent = null
    }

    val pickPluginLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val uri = result.data?.data
            if (uri != null) {
                val fileName = getFileNameFromUri(uri)
                if (!fileName.lowercase().endsWith(".js")) {
                    Toast.makeText(this, "Выберите файл с расширением .js", Toast.LENGTH_LONG).show()
                    return@registerForActivityResult
                }
                try {
                    contentResolver.openInputStream(uri)?.use { stream ->
                        val text = stream.bufferedReader(Charsets.UTF_8).use { it.readText() }
                        runOnUiThread {
                            currentWebView?.evaluateJavascript(
                                "if (window.onPluginFileImported) { window.onPluginFileImported(${org.json.JSONObject.quote(fileName)}, ${org.json.JSONObject.quote(text)}); }",
                                null
                            )
                        }
                    }
                } catch (e: Exception) {
                    Toast.makeText(this, "Ошибка чтения: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    fun launchPluginPicker() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
            putExtra(Intent.EXTRA_MIME_TYPES, arrayOf(
                "*/*",
                "text/plain",
                "text/javascript",
                "application/javascript",
                "application/x-javascript",
                "application/octet-stream"
            ))
        }
        try {
            pickPluginLauncher.launch(intent)
        } catch (_: Exception) {
            val fallbackIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "*/*"
            }
            pickPluginLauncher.launch(fallbackIntent)
        }
    }

    private fun getFileNameFromUri(uri: Uri): String {
        var name = "plugin.js"
        try {
            contentResolver.query(uri, null, null, null, null)?.use { cursor ->
                val nameIndex = cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME)
                if (nameIndex != -1 && cursor.moveToFirst()) {
                    name = cursor.getString(nameIndex)
                }
            }
        } catch (_: Exception) {}
        return name
    }

    fun launchSaveAsPicker(suggestedName: String, content: String) {
        pendingSaveContent = content
        val mime = getMimeTypeForFilename(suggestedName)
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = mime
            putExtra(Intent.EXTRA_TITLE, suggestedName)
        }
        saveDocumentLauncher.launch(intent)
    }

    fun getMimeTypeForFilename(name: String): String {
        val lower = name.lowercase()
        return when {
            lower.endsWith(".py") -> "text/x-python"
            lower.endsWith(".html") || lower.endsWith(".htm") -> "text/html"
            lower.endsWith(".js") -> "application/javascript"
            lower.endsWith(".json") -> "application/json"
            lower.endsWith(".css") -> "text/css"
            lower.endsWith(".md") || lower.endsWith(".txt") -> "text/plain"
            else -> "application/octet-stream"
        }
    }

    fun saveFileToWorkspace(relativePath: String, content: String): Boolean {
        val wsUri = currentWorkspaceUri ?: return false
        val rootDoc = androidx.documentfile.provider.DocumentFile.fromTreeUri(this, wsUri) ?: return false
        try {
            val parts = relativePath.split("/").filter { it.isNotEmpty() }
            if (parts.isEmpty()) return false
            var currentDir = rootDoc
            for (i in 0 until parts.size - 1) {
                val dirName = parts[i]
                var subDir = currentDir.findFile(dirName)
                if (subDir == null || !subDir.isDirectory) {
                    subDir = currentDir.createDirectory(dirName) ?: return false
                }
                currentDir = subDir
            }
            val fileName = parts.last()
            var targetFile = currentDir.findFile(fileName)
            if (targetFile == null || !targetFile.isFile) {
                val mime = getMimeTypeForFilename(fileName)
                targetFile = currentDir.createFile(mime, fileName) ?: return false
            }
            contentResolver.openOutputStream(targetFile.uri, "wt")?.use { out ->
                out.write(content.toByteArray(Charsets.UTF_8))
                out.flush()
            }
            return true
        } catch (e: Exception) {
            e.printStackTrace()
            return false
        }
    }

    private fun loadDirectoryTree(treeUri: Uri) {
        currentWorkspaceUri = treeUri
        val rootDoc = androidx.documentfile.provider.DocumentFile.fromTreeUri(this, treeUri) ?: return
        val rootName = rootDoc.name ?: "Workspace"
        Toast.makeText(this, "Reading folder: $rootName...", Toast.LENGTH_SHORT).show()

        Thread {
            val filesMap = org.json.JSONObject()
            readDocumentDirectory(rootDoc, "", filesMap, 0)

            runOnUiThread {
                val jsonString = filesMap.toString()
                currentWebView?.evaluateJavascript(
                    "if (window.onNativeFolderLoaded) { window.onNativeFolderLoaded(${org.json.JSONObject.quote(rootName)}, $jsonString); }",
                    null
                )
                Toast.makeText(this, "Loaded: $rootName (${filesMap.length()} files)", Toast.LENGTH_SHORT).show()
            }
        }.start()
    }

    private fun readDocumentDirectory(
        dir: androidx.documentfile.provider.DocumentFile,
        currentPath: String,
        result: org.json.JSONObject,
        depth: Int
    ) {
        if (depth > 5) return // prevent excessive recursion
        val children = dir.listFiles()
        for (child in children) {
            val name = child.name ?: continue
            if (name.startsWith(".") && name != ".env") continue // skip hidden/.git files

            val relPath = if (currentPath.isEmpty()) name else "$currentPath/$name"
            if (child.isDirectory) {
                readDocumentDirectory(child, relPath, result, depth + 1)
            } else if (child.isFile) {
                // Read text files up to 512KB
                if (child.length() < 512 * 1024) {
                    try {
                        contentResolver.openInputStream(child.uri)?.use { stream ->
                            val text = stream.bufferedReader(Charsets.UTF_8).use { it.readText() }
                            result.put(relPath, text)
                        }
                    } catch (_: Exception) {}
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // True Immersive Fullscreen: hide status bar and navigation bar
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        insetsController.hide(WindowInsetsCompat.Type.systemBars())

        setContent {
            MyApplicationTheme {
                RdeAppScreen(activity = this)
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun RdeAppScreen(activity: Activity) {
    var webViewRef by remember { mutableStateOf<WebView?>(null) }

    // Intercept back button to dismiss open drawers, modals or keyboards first
    BackHandler {
        webViewRef?.evaluateJavascript("window.handleAndroidBack ? window.handleAndroidBack() : false") { result ->
            val handled = result == "true"
            if (!handled) {
                activity.finish()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(VsCodeDarkBg)
            .testTag("rde_root_container")
    ) {
        AndroidView(
            modifier = Modifier
                .fillMaxSize()
                .testTag("rde_webview"),
            factory = { context ->
                WebView(context).apply {
                    layoutParams = android.view.ViewGroup.LayoutParams(
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    setBackgroundColor(0xFF1E1E1E.toInt())
                    isFocusable = true
                    isFocusableInTouchMode = true
                    webViewRef = this
                    (activity as? MainActivity)?.currentWebView = this

                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        databaseEnabled = true
                        allowFileAccess = true
                        allowContentAccess = true
                        javaScriptCanOpenWindowsAutomatically = true
                        @Suppress("DEPRECATION")
                        allowFileAccessFromFileURLs = true
                        @Suppress("DEPRECATION")
                        allowUniversalAccessFromFileURLs = true
                        useWideViewPort = false
                        loadWithOverviewMode = false
                        cacheMode = WebSettings.LOAD_DEFAULT
                        displayZoomControls = false
                        builtInZoomControls = false
                        mediaPlaybackRequiresUserGesture = false
                    }

                    // Native Android Bridge for JS interactions
                    addJavascriptInterface(AndroidBridge(activity, this), "AndroidBridge")

                    // WebChromeClient to handle alert, confirm, prompt, and system file chooser
                    webChromeClient = object : WebChromeClient() {
                        override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
                            consoleMessage?.let {
                                android.util.Log.d("RDE_JS", "[${it.messageLevel()}] ${it.message()} -- line ${it.lineNumber()} of ${it.sourceId()}")
                            }
                            return true
                        }

                        override fun onShowFileChooser(
                            view: WebView?,
                            filePathCallback: ValueCallback<Array<Uri>>?,
                            fileChooserParams: FileChooserParams?
                        ): Boolean {
                            (activity as? MainActivity)?.let { mainAct ->
                                mainAct.fileChooserCallback?.onReceiveValue(null)
                                mainAct.fileChooserCallback = filePathCallback
                                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                                    addCategory(Intent.CATEGORY_OPENABLE)
                                }
                                // Force type to */* and include wide MIME types so .js files are never grayed out by Android SAF
                                intent.type = "*/*"
                                intent.putExtra(Intent.EXTRA_MIME_TYPES, arrayOf(
                                    "*/*",
                                    "text/plain",
                                    "text/javascript",
                                    "application/javascript",
                                    "application/x-javascript",
                                    "application/octet-stream"
                                ))
                                try {
                                    mainAct.fileChooserLauncher.launch(intent)
                                    return true
                                } catch (e: Exception) {
                                    mainAct.fileChooserCallback = null
                                    return false
                                }
                            }
                            return false
                        }

                        override fun onJsAlert(
                            view: WebView?,
                            url: String?,
                            message: String?,
                            result: JsResult?
                        ): Boolean {
                            AlertDialog.Builder(context)
                                .setTitle("RDE")
                                .setMessage(message ?: "")
                                .setPositiveButton(android.R.string.ok) { _, _ -> result?.confirm() }
                                .setOnCancelListener { result?.cancel() }
                                .show()
                            return true
                        }

                        override fun onJsConfirm(
                            view: WebView?,
                            url: String?,
                            message: String?,
                            result: JsResult?
                        ): Boolean {
                            AlertDialog.Builder(context)
                                .setTitle("RDE")
                                .setMessage(message ?: "")
                                .setPositiveButton(android.R.string.ok) { _, _ -> result?.confirm() }
                                .setNegativeButton(android.R.string.cancel) { _, _ -> result?.cancel() }
                                .setOnCancelListener { result?.cancel() }
                                .show()
                            return true
                        }

                        override fun onJsPrompt(
                            view: WebView?,
                            url: String?,
                            message: String?,
                            defaultValue: String?,
                            result: JsPromptResult?
                        ): Boolean {
                            val input = EditText(context).apply {
                                setText(defaultValue ?: "")
                                setSelectAllOnFocus(true)
                            }
                            AlertDialog.Builder(context)
                                .setTitle("RDE")
                                .setMessage(message ?: "")
                                .setView(input)
                                .setPositiveButton(android.R.string.ok) { _, _ ->
                                    result?.confirm(input.text.toString())
                                }
                                .setNegativeButton(android.R.string.cancel) { _, _ ->
                                    result?.cancel()
                                }
                                .setOnCancelListener { result?.cancel() }
                                .show()
                            return true
                        }
                    }

                    webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                        }
                    }

                    loadUrl("file:///android_asset/index.html")
                }
            },
            update = {
                webViewRef = it
            }
        )
    }
}

/**
 * Android Bridge interface exposed to JavaScript as `window.AndroidBridge`
 */
class AndroidBridge(private val activity: Activity, private val webView: WebView) {

    @JavascriptInterface
    fun onCodeRunStarted() {
        activity.runOnUiThread {
            vibrateDevice(activity, 35)
        }
    }

    @JavascriptInterface
    fun onCodeRunFinished() {
        activity.runOnUiThread {
            vibrateDevice(activity, 20)
        }
    }

    @JavascriptInterface
    fun openDirectoryPicker() {
        activity.runOnUiThread {
            (activity as? MainActivity)?.openDirectoryLauncher?.launch(null)
        }
    }

    @JavascriptInterface
    fun pickPluginJsFile() {
        activity.runOnUiThread {
            (activity as? MainActivity)?.launchPluginPicker()
        }
    }

    @JavascriptInterface
    fun saveFile(fileName: String, content: String) {
        activity.runOnUiThread {
            val mainAct = activity as? MainActivity
            if (mainAct != null && mainAct.currentWorkspaceUri != null) {
                val success = mainAct.saveFileToWorkspace(fileName, content)
                if (success) {
                    Toast.makeText(activity, "Saved: $fileName", Toast.LENGTH_SHORT).show()
                    return@runOnUiThread
                }
            }
            // Fallback to SAF Save As picker if workspace is not set
            (activity as? MainActivity)?.launchSaveAsPicker(fileName, content)
        }
    }

    @JavascriptInterface
    fun saveFileAs(suggestedName: String, content: String) {
        activity.runOnUiThread {
            (activity as? MainActivity)?.launchSaveAsPicker(suggestedName, content)
        }
    }

    @JavascriptInterface
    fun saveFileToDownloads(fileName: String, content: String) {
        activity.runOnUiThread {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val values = ContentValues().apply {
                        put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                        put(MediaStore.MediaColumns.MIME_TYPE, "text/plain")
                        put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                    }
                    val uri = activity.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                    if (uri != null) {
                        activity.contentResolver.openOutputStream(uri)?.use { stream ->
                            stream.write(content.toByteArray(Charsets.UTF_8))
                        }
                        Toast.makeText(activity, "Saved to Downloads/$fileName", Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(activity, "Failed to create file in Downloads", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    val dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                    dir.mkdirs()
                    val file = File(dir, fileName)
                    file.writeText(content, Charsets.UTF_8)
                    Toast.makeText(activity, "Saved to Downloads/$fileName", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                Toast.makeText(activity, "Save error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    @JavascriptInterface
    fun shareCode(fileName: String, code: String) {
        activity.runOnUiThread {
            val sendIntent = Intent(Intent.ACTION_SEND).apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_SUBJECT, fileName)
                putExtra(Intent.EXTRA_TEXT, code)
                type = "text/plain"
            }
            val shareIntent = Intent.createChooser(sendIntent, "Export $fileName via")
            activity.startActivity(shareIntent)
        }
    }

    @JavascriptInterface
    fun showToast(message: String) {
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun vibrateDevice(context: Context, durationMs: Long) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator?.vibrate(
                    VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE)
                )
            } else {
                @Suppress("DEPRECATION")
                val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator?.vibrate(
                        VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE)
                    )
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(durationMs)
                }
            }
        } catch (_: Exception) {
            // Ignore vibration permission exceptions
        }
    }
}
