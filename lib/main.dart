import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

const Color _gameBackground = Color(0xFF0A0D10);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  runApp(const RoadRacerApp());
}

class RoadRacerApp extends StatelessWidget {
  const RoadRacerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Road Racer',
      debugShowCheckedModeBanner: false,
      color: _gameBackground,
      home: RacingGameScreen(),
    );
  }
}

class RacingGameScreen extends StatefulWidget {
  const RacingGameScreen({super.key});

  @override
  State<RacingGameScreen> createState() => _RacingGameScreenState();
}

class _RacingGameScreenState extends State<RacingGameScreen> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(_gameBackground)
      ..setNavigationDelegate(
        NavigationDelegate(
          onWebResourceError: (WebResourceError error) {
            debugPrint('Road Racer WebView: ${error.description}');
          },
        ),
      )
      ..loadFlutterAsset('assets/index.html');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _gameBackground,
      body: SizedBox.expand(
        child: WebViewWidget(controller: _controller),
      ),
    );
  }
}
