import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { FileService } from './services/file.service';
import { Subscription } from 'rxjs';
import { Apiresponse } from './entities/apiresponse';
import { User } from './entities/user';
import { HttpErrorResponse } from '@angular/common/http';
import { MongooseValidationError } from './entities/mongooseValidationError';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Extract data from csv file';
  suscripcion: Subscription = new Subscription();
  users: User[] = []
  selectedFile!: File
  modalTitle: string = ""
  modalMessage: string = ""

  csvForm = new FormGroup({
    file: new FormControl<any | null>(null, Validators.compose([Validators.required, this.ValidateCSV()]))
  })

  filterForm = new FormGroup({
    parameter: new FormControl<string>("", Validators.required)
  })

  constructor(private fileservice: FileService) {}

  ngOnInit(): void {
    this.getUsers()

    this.suscripcion = this.fileservice._refresh$.subscribe(() => {
      this.getUsers()
    })
  }

  readFile(fileEvent: any) {
    const file = fileEvent.target.files[0];
    this.selectedFile = file
  }

  // Necesario para comprobar en el .html que file tiene errores
  get file() {
    return this.csvForm.get('file')
  }

  // Permite validar si un input tiene formato csv
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

  getUsers () {
    this.fileservice.getUsers().subscribe({
      next: (response: Apiresponse) => {
        if (response.data) {
          this.users = response.data
        }
      },
      error: (error) => {
        this.showModal("⚠️ Error en la operación", "Servicio no disponible.")
      }
    })
  }

  sendCSV() {
    if (this.csvForm.valid && this.csvForm.value.file) { // Lo segundo es que el valor sea truthy (ni null ni undefined)
      const formData = new FormData()
      formData.append('file', this.selectedFile)
      this.fileservice.postCSV(formData).subscribe({
        next: (response: Apiresponse) => {
          this.showModal('✅ Operación correcta', 'Se ha recibido y procesado el archivo.')
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 422) {
            const errors: MongooseValidationError[] = error.error.error.errors
            let messageErrors: string = ""
            Object.values(errors).forEach(err => {
              messageErrors += err.message + '\n'
            })
            this.showModal("⚠️ Error en la operación: ", messageErrors)
          } else {
            this.showModal("⚠️ Error en la operación", "Servicio no disponible.")
          }
        }
      })
    }
  }

  filter () {
    if (this.filterForm.valid) {
      this.fileservice.getUsers(this.filterForm.value.parameter ?? "").subscribe({
        next: (response: Apiresponse) => {
          if (response.data) {
            this.users = response.data
          }
        },
        error: (error) => {
          this.showModal("⚠️ Error en la operación", "Servicio no disponible.")
        }
      })
    } else {
      this.getUsers()
    }
  }

  showModal (title: string, message: string) {
    this.modalTitle = title
    this.modalMessage = message
    const dialog = document.getElementById('modal-message') as HTMLDialogElement
    dialog?.showModal()
  }
}
