package com.example

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.webkit.JsPromptResult
import android.webkit.JsResult
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
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.MaterialTheme
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

class MainActivity : ComponentActivity() {

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

    // Intercept back button to dismiss open drawers or dialogs first
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
                    }

                    // Native Android Bridge for JS interactions
                    addJavascriptInterface(AndroidBridge(activity, this), "AndroidBridge")

                    // WebChromeClient to handle alert, confirm, and prompt dialogs
                    webChromeClient = object : WebChromeClient() {
                        override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
                            consoleMessage?.let {
                                android.util.Log.d("RDE_JS", "[${it.messageLevel()}] ${it.message()} -- line ${it.lineNumber()} of ${it.sourceId()}")
                            }
                            return true
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
                // Keep webview reference fresh
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
