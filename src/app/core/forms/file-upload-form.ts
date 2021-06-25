import { FormGroup } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

class FileUploadForm {
    constructor(private formGroup: FormGroup){
    }

    get asFormGroup(){
        return this.formGroup;
    }

    isValid() : Observable<boolean> {
        return this.formGroup.statusChanges.pipe(
            map(() => this.formGroup.valid),
            startWith(false)
        );
    }
}