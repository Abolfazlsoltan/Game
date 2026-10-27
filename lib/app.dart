import 'package:flutter/material.dart';
import 'screens/racing_game_screen.dart';

const Color gameBackground = Color(0xFF0A0D10);

class RoadRacerApp extends StatelessWidget {
  const RoadRacerApp({super.key});
  @override
  Widget build(BuildContext context) => const MaterialApp(
    title: 'Road Racer', debugShowCheckedModeBanner: false,
    color: gameBackground, home: RacingGameScreen(),
  );
}
