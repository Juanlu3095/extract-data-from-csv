import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormControl, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors, Validators, ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Extract data from csv file';

  csvForm = new FormGroup({
    file: new FormControl<File | null>(null, Validators.compose([Validators.required, this.ValidateCSV()]))
  })

  readFile(fileEvent: any) {
   const file = fileEvent.target.files[0];
   console.log('size', file.size);
   console.log('type', file.type);
  }

  // Necesario para comprobar en el .html que file tiene errores
  get file() {
    return this.csvForm.get('file')
  }

  ValidateCSV(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file: string = control.value
      
      if (!file) return null

      if (!file.endsWith(".csv")) {
        return {
          invalidFileFormat: true
        }
      }

      return null
    }
  }

  onSubmit() {
    if (this.csvForm.valid) {
      console.log(this.csvForm.value)

    }
  }
}
