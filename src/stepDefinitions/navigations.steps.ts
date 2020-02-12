import { binding, when } from 'cucumber-tsflow/dist';
import { Helper } from 'src/utils/helper';

@binding()
export class NavigationsSteps {
    @when(/^Click to result$/)
    public whenSearchClicked() {
        $$('div[data-hveid] h3')[1].click();
        browser.pause(5000);
        const a = {name:'Andrii', age:'22'};
        console.log("General context: "+this);
        Helper.addWorldValue(this,'Person',a);

        const b = Helper.getWorldValue('Person',this);
        console.log(b)
    }
}
