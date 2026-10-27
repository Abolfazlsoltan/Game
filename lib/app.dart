import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'screens/racing_game_screen.dart';

class RoadRacerApp extends StatelessWidget {
  const RoadRacerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Road Racer',
      debugShowCheckedModeBanner: false,
      color: gameBackground,
      home: RacingGameScreen(),
    );
  }
}
