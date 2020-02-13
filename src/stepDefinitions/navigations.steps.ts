import { Then } from "cucumber";
import { Helper } from 'src/utils/helper';

Then(/^Click to result$/,function() {
    $(".SignUp-loginForm-button").click();
    browser.pause(5000);
    const a = {name:'Andrii', age:'22'};
    this.keepValue('test',a);
    Helper.addWorldValue(this,'Person',a);
    console.log("General context: "+JSON.stringify(this));
    Helper.addWorldValue(this,'Person',a);

    const b = Helper.getWorldValue('Person',this);
    console.log(b)
});
