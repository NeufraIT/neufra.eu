locations.forEach(loc => {
    const dot = {
        "id": "oval-" + (3008 + loc.id),
        "title": loc.name,
        "type": "oval",
        "x": loc.x,
        "y": loc.y,
        "width": mobileVersion ? 0.7: notDesktopVersion? 0.9 : 1,
        "height": mobileVersion ? 0.7*1.18: notDesktopVersion? 0.9*1.18 : 1*1.18,
        "x_image_background": loc.x,
        "y_image_background": loc.y,
        "width_image_background": 0.518,
        "height_image_background": 0.655,
        "actions": {
            "click": "run-script",
            "script": `$(\"#showDetailsBtn\").html(\"${loc.abr}\"); $(\"#showDetailsBtn\").click();`
        },
        "default_style": {
            "background_color": "#007032",
            "background_opacity": 1,
            "border_width": mobileVersion ? 1 : 2
        },
        "mouseover_style": {
            "background_color": "#007032",
            "border_width": mobileVersion ? 2 : 4
        },
        "tooltip_content": {
            "squares_settings": {
                "containers": [{
                    "id": "sq-container-382881",
                    "settings": {
                        "elements": [{
                            "settings": {
                                "name": "Heading",
                                "iconClass": "fa fa-header"
                            },
                            "options": {
                                "heading": {
                                    "text": loc.name
                                }
                            }
                        }]
                    }
                }]
            }
        }
    }
    const dotName = {
        "id": "text-" + (4601 + loc.id),
        "title": loc.name + "Name",
        "type": "text",
        "x": mobileVersion ? loc.x - 0.2: notDesktopVersion? loc.x - 0.25 :loc.x - 0.3,
        "y": mobileVersion ? loc.y + 0.9: notDesktopVersion? loc.y + 1.05 : loc.y + 1.2,
        "x_image_background": mobileVersion ? loc.x - 0.2: notDesktopVersion? loc.x - 0.25 :loc.x - 0.3,
        "y_image_background":  mobileVersion ? loc.y + 0.9: notDesktopVersion? loc.y + 1.05 : loc.y + 1.2,
        "text": {
            "text": loc.name,
            "font_family": "Roboto",
            "font_size": mobileVersion ? 5 : notDesktopVersion? 7 : 9
        },
        "tooltip_content": {
            "squares_settings": {
                "containers": [{
                    "id": "sq-container-403761",
                    "settings": {
                        "elements": [{
                            "settings": {
                                "name": "Heading",
                                "iconClass": "fa fa-header"
                            },
                            "options": {
                                "heading": {
                                    "text": "Text 0"
                                }
                            }
                        }]
                    }
                }]
            }
        }
    }
    inputCode.spots.push(dot)
    inputCode.spots.push(dotName)
});

// console.log(inputCode);
