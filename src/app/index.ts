import '../style/app.scss';

import * as _ from 'lodash';

class TestClass {
    constructor() {
        let msg = 'Using ES2015+ syntax';
        console.log(msg);

        _.each([1, 2, 3], (i) => {
            console.log(i);
        })
    }
}

let test: TestClass = new TestClass();

