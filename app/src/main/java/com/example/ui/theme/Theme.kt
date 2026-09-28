package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val VsCodeDarkColorScheme = darkColorScheme(
    primary = VsCodeBlue,
    secondary = VsCodeCyan,
    tertiary = VsCodeGreen,
    background = VsCodeDarkBg,
    surface = VsCodePanelBg,
    onPrimary = VsCodeTextBright,
    onSecondary = VsCodeDarkBg,
    onTertiary = VsCodeDarkBg,
    onBackground = VsCodeTextMain,
    onSurface = VsCodeTextMain,
    outline = VsCodeBorder
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Force consistent VS Code Dark+ styling
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = VsCodeDarkColorScheme,
        typography = Typography,
        content = content
    )
}
