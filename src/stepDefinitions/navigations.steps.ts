// import { binding, when } from 'cucumber-tsflow/dist';
import { Helper } from 'src/utils/helper';
import { Then } from "cucumber";

// @binding()
// export class NavigationsSteps {
//     @when(/^Click to result$/)
//     public whenSearchClicked() {
//
//     }
// }

Then(/^Click to result$/,function() {
    browser.url("http://www.google.com");
    // browser.pause(5000);
    const a = {name:'Andrii', age:'22'};
    Helper.addWorldValue(this,'Person',a);
    this.keepValue('test',a);

    const b = Helper.getWorldValue('%{Person.name}',this);
    console.log(b)
});
