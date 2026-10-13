package DisanayakeOilCenter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardingController {

    // Add all of your main React routes to this list
    @RequestMapping({
            "/shop", "/shop/**",
            "/employee", "/employee/**"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}