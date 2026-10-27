import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../app_colors.dart';

class RacingGameScreen extends StatefulWidget {
  const RacingGameScreen({super.key});

  @override
  State<RacingGameScreen> createState() => _RacingGameScreenState();
}

class _RacingGameScreenState extends State<RacingGameScreen>
    with WidgetsBindingObserver {
  late final WebViewController _controller;
  bool _loadFailed = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(gameBackground)
      ..setNavigationDelegate(
        NavigationDelegate(
          onWebResourceError: (WebResourceError error) {
            if (!mounted || error.isForMainFrame == false) return;
            setState(() => _loadFailed = true);
            debugPrint('Road Racer WebView: ' + error.description);
          },
        ),
      )
      ..loadFlutterAsset('assets/index.html');
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState lifecycle) {
    if (lifecycle == AppLifecycleState.inactive ||
        lifecycle == AppLifecycleState.paused ||
        lifecycle == AppLifecycleState.detached) {
      _controller
          .runJavaScript(
        "if (window.RoadRacer && window.RoadRacer.ui) window.RoadRacer.ui.pauseGame();",
      )
          .catchError((Object error) {
        debugPrint('Road Racer pause bridge: $error');
      });
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: gameBackground,
      body: Stack(
        fit: StackFit.expand,
        children: [
          WebViewWidget(controller: _controller),
          if (_loadFailed)
            ColoredBox(
              color: gameBackground,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: Colors.white70,
                        size: 42,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'بازی بارگذاری نشد',
                        style: TextStyle(color: Colors.white, fontSize: 18),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'برنامه را دوباره باز کن و اتصال فایل‌های بازی را بررسی کن.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white70),
                      ),
                      const SizedBox(height: 16),
                      FilledButton(
                        onPressed: () {
                          setState(() => _loadFailed = false);
                          _controller.loadFlutterAsset('assets/index.html');
                        },
                        child: const Text('تلاش دوباره'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
