import asyncio
import random
import flet as ft

# Road Racer — نسخه‌ی قابل‌بازی اولیه
# حرکت با دکمه‌های پایین صفحه؛ تمرکز روی ماشین و جاده است.


CAR_W = 124
CAR_H = 222
ROAD_W = 286
GREEN = "#315B43"
ASPHALT = "#30343A"
RED = "#E52E3D"


def shape(width, height, color, radius=8, **kwargs):
    return ft.Container(
        width=width, height=height, bgcolor=color,
        border_radius=radius, **kwargs
    )


def placed(control, left=None, top=None, right=None, bottom=None):
    control.left, control.top = left, top
    control.right, control.bottom = right, bottom
    return control


def build_car():
    p = []
    # چرخ‌ها
    for x in (4, 94):
        for y in (34, 126):
            p.append(placed(shape(20, 43, "#101318", 7,
                                  border=ft.Border.all(1, "#454B54")),
                            x, y))
            p.append(placed(shape(4, 29, "#454B54", 2), x + 8, y + 7))

    # بدنه‌ی قرمز با لبه‌ی براق
    p.append(placed(shape(
        96, 196, "#B51F2B", 31,
        
        gradient=ft.LinearGradient(
            begin=ft.Alignment(-1, 0), end=ft.Alignment(1, 0),
            colors=["#7F101B", "#E52E3D", "#B51F2B"],
        )), 16, 10))

    # کاپوت، چراغ‌ها و شیشه‌ی جلو
    p.append(placed(shape(70, 48, "#D92A38", 19,
                          border=ft.Border.all(1, "#F56A70")), 29, 18))
    p.append(placed(shape(46, 3, "#F58A8E", 2), 41, 29))
    for x in (26, 83):
        p.append(placed(shape(17, 7, "#FFF1B8", 3,
                              border=ft.Border.all(1, "#FFFFFF")), x, 14))
    p.append(placed(shape(
        65, 42, "#182E40", 12,
        
        gradient=ft.LinearGradient(
            begin=ft.Alignment(-1, -1), end=ft.Alignment(1, 1),
            colors=["#8CB9CE", "#31566D", "#152B3D"],
        )), 31, 66))
    p.append(placed(shape(43, 3, "#B7D9E8", 2), 42, 75))
    p.append(placed(shape(68, 5, "#70131C", 2), 30, 113))
    p.append(placed(shape(
        62, 29, "#244357", 9,
        
        gradient=ft.LinearGradient(
            begin=ft.Alignment(-1, 0), end=ft.Alignment(1, 0),
            colors=["#6D9DB4", "#213F52"],
        )), 33, 121))

    # آینه‌ها و چراغ عقب
    p.append(placed(shape(13, 20, "#C82432", 5), 8, 65))
    p.append(placed(shape(13, 20, "#C82432", 5), 107, 65))
    for x in (25, 84):
        p.append(placed(shape(17, 6, "#FF7A72", 3), x, 199))
    p.append(placed(shape(3, 42, "#F16B72", 2), 25, 77))
    p.append(placed(shape(3, 42, "#F16B72", 2), 100, 77))

    return ft.Stack(
        controls=p, width=CAR_W, height=CAR_H,
        clip_behavior=ft.ClipBehavior.NONE,
    )


def main(page: ft.Page):
    page.title = "Road Racer"
    page.bgcolor = "#101820"
    page.padding = 0
    page.spacing = 0
    page.theme_mode = ft.ThemeMode.DARK
    page.window_min_width = 320
    page.window_min_height = 560

    car_offset = 0
    distance = 0
    speed = 1
    running = True
    stripe_y = [i * 126 - 30 for i in range(10)]
    stripe_controls = []
    obstacle_controls = []
    obstacles = []
    car_slot = ft.Container(width=CAR_W, height=CAR_H, content=build_car())
    car_shadow = ft.Container(
        width=CAR_W, height=CAR_H, content=car_slot,
        shadow=ft.BoxShadow(
            blur_radius=22, spread_radius=1, color="#77000000",
            offset=ft.Offset(0, 10),
        ),
    )
    road = ft.Stack(expand=True, clip_behavior=ft.ClipBehavior.HARD_EDGE)

    distance_text = ft.Text("0000 m", size=15, weight=ft.FontWeight.BOLD,
                            color="#FFFFFF")
    speed_text = ft.Text("SPEED  1x", size=11, color="#B8F36B")
    message_text = ft.Text("حرکت کن و مسیر را دنبال کن", size=11,
                           color="#AAB7C4")

    def scene_width():
        return max(320, page.width or 360)

    def road_left():
        return (scene_width() - ROAD_W) / 2

    def layout_scene():
        w = scene_width()
        xroad = road_left()
        road.controls.clear()
        road.controls.append(placed(shape(w, 2000, GREEN, 0), 0, 0))
        road.controls.append(placed(shape(ROAD_W + 28, 2000, "#AEB4AE", 0),
                                    xroad - 14, 0))
        road.controls.append(placed(shape(ROAD_W, 2000, ASPHALT, 0),
                                    xroad, 0))
        road.controls.append(placed(shape(4, 2000, "#F4F0D8", 0),
                                    xroad + 13, 0))
        road.controls.append(placed(shape(4, 2000, "#F4F0D8", 0),
                                    xroad + ROAD_W - 17, 0))
        stripe_controls.clear()
        for y in stripe_y:
            c = placed(shape(6, 52, "#E8E7D9", 3), xroad + ROAD_W / 2 - 3, y)
            stripe_controls.append(c)
            road.controls.append(c)
        for obs in obstacle_controls:
            road.controls.append(obs)
        car_x = xroad + ROAD_W / 2 - CAR_W / 2 + car_offset
        car_shadow.left = car_x
        car_shadow.top = max(80, (page.height or 700) * 0.57 - CAR_H / 2)
        road.controls.append(car_shadow)
        road.update()

    def move_left(_):
        nonlocal car_offset
        car_offset = max(-ROAD_W / 2 + 30, car_offset - 28)
        layout_scene()

    def move_right(_):
        nonlocal car_offset
        car_offset = min(ROAD_W / 2 - 30, car_offset + 28)
        layout_scene()

    def boost(_):
        nonlocal speed
        speed = 3 if speed == 1 else 1
        speed_text.value = f"SPEED  {speed}x"
        message_text.value = "توربو روشن شد!" if speed == 3 else "سرعت عادی"
        page.update()

    def reset(_):
        nonlocal car_offset, distance, speed
        car_offset, distance, speed = 0, 0, 1
        distance_text.value = "0000 m"
        speed_text.value = "SPEED  1x"
        message_text.value = "مسیر از نو شروع شد"
        stripe_y[:] = [i * 126 - 30 for i in range(10)]
        obstacles.clear()
        obstacle_controls.clear()
        layout_scene()
        page.update()

    header = ft.Container(
        padding=ft.padding.symmetric(horizontal=18, vertical=13),
        bgcolor="#17212B",
        content=ft.Row([
            ft.Column([
                ft.Text("ROAD RACER", size=19, weight=ft.FontWeight.BOLD,
                        color="#FFFFFF"),
                ft.Text("CAR DESIGN  •  STAGE 01", size=10, color="#9DAAB6"),
            ], spacing=2),
            ft.Container(expand=True),
            ft.Column([distance_text, speed_text], spacing=2,
                      horizontal_alignment=ft.CrossAxisAlignment.END),
        ], vertical_alignment=ft.CrossAxisAlignment.CENTER),
    )

    def control_button(symbol, caption, handler, color="#263543"):
        return ft.Container(
            content=ft.Column([
                ft.Icon(symbol, size=25, color="#FFFFFF"),
                ft.Text(caption, size=10, color="#B9C5CF",
                        weight=ft.FontWeight.BOLD),
            ], horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=2),
            bgcolor=color, border_radius=18,
            
            padding=ft.padding.symmetric(horizontal=18, vertical=10),
            on_click=handler, ink=True,
            expand=True,
        )

    controls = ft.Container(
        bgcolor="#17212B",
        padding=ft.padding.only(left=14, right=14, top=10, bottom=14),
        content=ft.Column([
            ft.Row([
                control_button(ft.Icons.ARROW_BACK_IOS_NEW, "چپ", move_left),
                control_button(ft.Icons.ARROW_FORWARD_IOS, "راست", move_right),
                control_button(ft.Icons.BOLT, "توربو", boost, "#3B4529"),
                control_button(ft.Icons.REPLAY, "شروع مجدد", reset),
            ], spacing=8),
            ft.Container(height=4),
            ft.Row([
                ft.Text("ROAD RACER", size=10, color="#778795"),
                ft.Container(expand=True),
                message_text,
            ]),
        ], spacing=5),
    )

    page.add(ft.Column([
        header,
        ft.Container(content=road, expand=True),
        controls,
    ], expand=True, spacing=0))

    layout_scene()

    async def game_loop():
        nonlocal distance
        while running:
            await asyncio.sleep(0.075)
            for i in range(len(stripe_y)):
                stripe_y[i] += 5 * speed
                if stripe_y[i] > (page.height or 700):
                    stripe_y[i] = -60
            distance += speed
            distance_text.value = f"{distance:04d} m"
            for i, c in enumerate(stripe_controls):
                c.top = stripe_y[i]
            try:
                road.update()
                page.update()
            except Exception:
                break

    page.run_task(game_loop)


if __name__ == "__main__":
    ft.run(main)
