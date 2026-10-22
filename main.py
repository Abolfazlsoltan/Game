import flet as ft


# مرحله اول بازی: فقط نمای بالا، طراحی ماشین و بخشی از جاده
# همه اجزای ماشین با کنترل‌های خود Flet ساخته شده‌اند؛ تصویر خارجی لازم نیست.


def shape(width, height, color, radius=8, **kwargs):
    return ft.Container(
        width=width,
        height=height,
        bgcolor=color,
        border_radius=radius,
        **kwargs,
    )


def positioned(control, left=None, top=None, right=None, bottom=None):
    # در Flet، مختصات مستقیماً روی کنترل فرزند Stack قرار می‌گیرند.
    control.left = left
    control.top = top
    control.right = right
    control.bottom = bottom
    return control


def build_car():
    parts = []

    # سایه‌ی نرم زیر خودرو
    parts.append(positioned(
        shape(112, 204, "#28000000", 29),
        left=14, top=14,
    ))

    # چهار چرخ؛ از نمای بالا
    for x in (4, 94):
        for y in (34, 126):
            parts.append(positioned(
                shape(20, 43, "#101318", 7,
                      border=ft.border.all(1, "#3B414A")),
                left=x, top=y,
            ))
            parts.append(positioned(
                shape(4, 29, "#454B54", 2),
                left=x + 8, top=y + 7,
            ))

    # بدنه‌ی اصلی و لبه‌ی براق
    parts.append(positioned(
        shape(96, 196, "#B51F2B", 31,
              border=ft.border.all(2, "#F06A70"),
              gradient=ft.LinearGradient(
                  begin=ft.Alignment(-1, 0),
                  end=ft.Alignment(1, 0),
                  colors=["#7F101B", "#E52E3D", "#B51F2B"],
              )),
        left=16, top=10,
    ))

    # کاپوت جلو
    parts.append(positioned(
        shape(70, 48, "#D92A38", 19,
              border=ft.border.all(1, "#F56A70")),
        left=29, top=18,
    ))
    parts.append(positioned(
        shape(46, 3, "#F58A8E", 2),
        left=41, top=29,
    ))

    # چراغ‌های جلو
    for x in (26, 83):
        parts.append(positioned(
            shape(17, 7, "#FFF1B8", 3,
                  border=ft.border.all(1, "#FFFFFF")),
            left=x, top=14,
        ))

    # شیشه‌ی جلو با بازتاب نور
    parts.append(positioned(
        shape(65, 42, "#182E40", 12,
              border=ft.border.all(2, "#7193A7"),
              gradient=ft.LinearGradient(
                  begin=ft.Alignment(-1, -1),
                  end=ft.Alignment(1, 1),
                  colors=["#8CB9CE", "#31566D", "#152B3D"],
              )),
        left=31, top=66,
    ))
    parts.append(positioned(
        shape(43, 3, "#B7D9E8", 2),
        left=42, top=75,
    ))

    # ستون میانی و شیشه‌ی عقب
    parts.append(positioned(
        shape(68, 5, "#70131C", 2),
        left=30, top=113,
    ))
    parts.append(positioned(
        shape(62, 29, "#244357", 9,
              border=ft.border.all(2, "#7193A7"),
              gradient=ft.LinearGradient(
                  begin=ft.Alignment(-1, 0),
                  end=ft.Alignment(1, 0),
                  colors=["#6D9DB4", "#213F52"],
              )),
        left=33, top=121,
    ))

    # آینه‌ها
    parts.append(positioned(shape(13, 20, "#C82432", 5), left=8, top=65))
    parts.append(positioned(shape(13, 20, "#C82432", 5), left=107, top=65))

    # چراغ‌های عقب
    for x in (25, 84):
        parts.append(positioned(
            shape(17, 6, "#FF7A72", 3),
            left=x, top=199,
        ))

    # جزئیات جانبی بدنه
    parts.append(positioned(shape(3, 42, "#F16B72", 2), left=25, top=77))
    parts.append(positioned(shape(3, 42, "#F16B72", 2), left=100, top=77))

    return ft.Stack(
        controls=parts,
        width=124,
        height=222,
        clip_behavior=ft.ClipBehavior.NONE,
    )


def main(page: ft.Page):
    page.title = "Road Racer — Car Prototype"
    page.bgcolor = "#101820"
    page.padding = 0
    page.spacing = 0
    page.theme_mode = ft.ThemeMode.DARK

    # جاده و ماشین در یک صحنه‌ی ساده‌ی عمودی
    scene_parts = [
        # چمن اطراف مسیر
        positioned(shape(1000, 1000, "#315B43", 0), left=0, top=0),

        # شانه‌های آسفالت
        positioned(shape(300, 1000, "#B5B8B2", 0), left=0, top=0),
        positioned(shape(300, 1000, "#B5B8B2", 0), right=0, top=0),

        # آسفالت
        positioned(shape(260, 1000, "#30343A", 0), left=0, top=0),

        # لبه‌های سفید جاده
        positioned(shape(4, 1000, "#F4F0D8", 0), left=18, top=0),
        positioned(shape(4, 1000, "#F4F0D8", 0), right=18, top=0),

        # خط‌چین وسط مسیر
        *[
            positioned(shape(6, 54, "#E8E7D9", 3), left=127, top=y)
            for y in (-10, 115, 240, 365, 490, 615, 740, 865)
        ],

        # سایه‌ی کلی ماشین و خود ماشین
        positioned(
            ft.Container(
                content=build_car(),
                width=124,
                height=222,
                shadow=ft.BoxShadow(
                    blur_radius=24,
                    spread_radius=2,
                    color="#66000000",
                    offset=ft.Offset(0, 10),
                ),
            ),
            left=88,
            top=280,
        ),
    ]

    road_scene = ft.Stack(
        controls=scene_parts,
        expand=True,
        clip_behavior=ft.ClipBehavior.HARD_EDGE,
    )

    header = ft.Container(
        content=ft.Row(
            controls=[
                ft.Column(
                    controls=[
                        ft.Text("ROAD RACER", size=19, weight=ft.FontWeight.BOLD,
                                color="#FFFFFF"),
                        ft.Text("CAR DESIGN PROTOTYPE", size=10,
                                color="#9DAAB6"),
                    ],
                    spacing=2,
                ),
                ft.Container(expand=True),
                ft.Container(
                    content=ft.Text("STAGE 01", size=11,
                                    weight=ft.FontWeight.BOLD, color="#B8F36B"),
                    padding=ft.padding.symmetric(horizontal=12, vertical=8),
                    border=ft.border.all(1, "#526C3B"),
                    border_radius=20,
                ),
            ],
            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
        ),
        padding=ft.padding.symmetric(horizontal=18, vertical=13),
        bgcolor="#17212B",
    )

    page.add(
        ft.Column(
            controls=[
                header,
                ft.Container(
                    content=road_scene,
                    expand=True,
                    clip_behavior=ft.ClipBehavior.HARD_EDGE,
                ),
            ],
            expand=True,
            spacing=0,
        )
    )


if __name__ == "__main__":
    ft.run(main)
