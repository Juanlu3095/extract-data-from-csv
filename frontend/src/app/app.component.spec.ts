import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Observable, of, Subject } from 'rxjs';
import { Apiresponse } from './entities/apiresponse';
import { appConfig } from './app.config';
import { UserService } from './services/user.service';
import { FileService } from './services/file.service';
import { By } from '@angular/platform-browser';

const mockGetUsersNoParamResponse = {
  data: [
    {
      "_id": "69a376550382cef2721d4a34",
      "nombre": "Ana",
      "apellido": "Garc�a",
      "email": "ana.garcia@email.com",
      "telefono": "600123456",
      "ciudad": "Madrid",
      "fecha_inscripcion": "2026-02-10",
      "__v": 0
    },
    {
      "_id": "69a376550382cef2721d4a35",
      "nombre": "Carlos",
      "apellido": "L�pez",
      "email": "carlos.lopez@email.com",
      "telefono": "611234567",
      "ciudad": "Barcelona",
      "fecha_inscripcion": "2026-02-11",
      "__v": 0
    }
  ]
}

const mockGetUsersWithParamResponse = {
  data: [
    {
      "_id": "69a376550382cef2721d4a34",
      "nombre": "Ana",
      "apellido": "Garc�a",
      "email": "ana.garcia@email.com",
      "telefono": "600123456",
      "ciudad": "Madrid",
      "fecha_inscripcion": "2026-02-10",
      "__v": 0
    }
  ]
}

const mockPostCSVResponse = {
  message: "El archivo se cargó correctamente.", 
  data: [
    {
     "_id": "69a376550382cef2721d4a34",
     "nombre": "Ana",
     "apellido": "Garc�a",
     "email": "ana.garcia@email.com",
     "telefono": "600123456",
     "ciudad": "Madrid",
     "fecha_inscripcion": "2026-02-10",
     "__v": 0
    },
    {
     "_id": "69a376550382cef2721d4a35",
     "nombre": "Carlos",
     "apellido": "L�pez",
     "email": "carlos.lopez@email.com",
     "telefono": "611234567",
     "ciudad": "Barcelona",
     "fecha_inscripcion": "2026-02-11",
      "__v": 0
    }
  ]
}

const mockUserService : {
  _refresh$: Subject<void>,
  getUsers: (param?: string) => Observable<Apiresponse>
} = {
  _refresh$: new Subject<void>(),
  getUsers: () => of(mockGetUsersNoParamResponse)
}

const mockFileService: {
  _refresh$: Subject<void>,
  postCSV: (form: FormData) => Observable<Apiresponse>
} = {
  _refresh$: new Subject<void>(),
  postCSV: () => of(mockPostCSVResponse)
}

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let userService: UserService
  let fileService: FileService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers,
      {
        provide: UserService,
        useValue: mockUserService
      },
      {
        provide: FileService,
        useValue: mockFileService
      }
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent); // Creamos un objeto
    component = fixture.componentInstance; // Recuperamos la clase del componente
    userService = TestBed.inject(UserService)
    fileService = TestBed.inject(FileService)
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy()
  });

  it(`should have the 'frontend' title`, () => {
    expect(component.title).toEqual('Extract data from csv file')
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Extract data from csv file');
  });

  it('should get users OnInit', (done: DoneFn) => {
    const userServiceSpy = spyOn(userService, 'getUsers')
    userServiceSpy.and.returnValue(of(mockGetUsersNoParamResponse))

    component.ngOnInit()

    expect(userServiceSpy).toHaveBeenCalled()
    expect(component.users).toEqual(mockGetUsersNoParamResponse.data)
    expect(component.users[0].nombre).toEqual('Ana')
    done()
  })

  it('should get file from csvForm', (done: DoneFn) => {
    // El navegador bloquea asignar value en <input type="file"> y no se puede usar patchValue
    const control = component.csvForm.get('file');
    expect(component.file).toBe(control);
    done()
  })

  it('should validate csvForm', (done: DoneFn) => {
    const fileServiceSpy = spyOn(fileService, 'postCSV')
    fileServiceSpy.and.returnValue(of(mockPostCSVResponse))

    spyOn(component, 'sendCSV');
    spyOn(component, 'showModal')

    component.sendCSV()

    expect(component.selectedFile).toBeUndefined()
    expect(component.sendCSV).toHaveBeenCalled()
    expect(component.showModal).not.toHaveBeenCalled()
    expect(fileServiceSpy).not.toHaveBeenCalled()
    done()
  })

  it('should get users', (done: DoneFn) => {
    const userServiceSpy = spyOn(userService, 'getUsers')
    userServiceSpy.and.returnValue(of(mockGetUsersNoParamResponse))

    component.getUsers()

    expect(userServiceSpy).toHaveBeenCalled()
    expect(component.users).toEqual(mockGetUsersNoParamResponse.data)
    expect(component.users[0].nombre).toEqual('Ana')
    done()
  })

  it('should read file', (done: DoneFn) => {
    const fileContent = ['nombre,apellido,email,telefono,ciudad,fecha_inscripcion\n' +
      'Ana,García,ana.garcia@email.com,600123456,Madrid,2026-02-10']
    const mockFile = new File(fileContent, 'example.csv', {
      type: 'text/csv',
      lastModified: Date.now()
    })
    const event = {
      target: {
        files: [mockFile]
      }
    } as any;

    component.readFile(event)
    expect(component.selectedFile).toEqual(mockFile)
    done()
  })

  it('should send csv and show modal', (done: DoneFn) => {
    const fileServiceSpy = spyOn(fileService, 'postCSV')
    fileServiceSpy.and.returnValue(of(mockPostCSVResponse))

    // Por seguridad no se puede poner un valor a un input type=file desde fuera del html, por ello hay que mockear ValidateCSV()
    const spyValidateCsv = spyOn(component, 'ValidateCSV')
    spyValidateCsv.and.returnValue(() => null)
    const spyShowModal = spyOn(component, 'showModal')

    const fileContent = ['nombre,apellido,email,telefono,ciudad,fecha_inscripcion\n' +
      'Ana,García,ana.garcia@email.com,600123456,Madrid,2026-02-10']
    const mockFile = new File(fileContent, 'example.csv', {
      type: 'text/csv',
      lastModified: Date.now()
    })

    // https://stackoverflow.com/questions/55356093/how-to-write-the-unit-testing-for-the-file-upload-method-in-the-angular-7-or-2
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(mockFile)
    const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
    inputDebugEl.nativeElement.files = dataTransfer.files;

    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
    fixture.detectChanges()

    const event = {
      target: {
        files: [mockFile]
      }
    } as any;

    component.readFile(event)
    component.sendCSV()

    // No se puede pasar mockFile al input por seguridad, ni tampoco se puede quitar formControl del HTML y usar setValue para
    // pasarle el archivo, este test no pasa
    expect(component.selectedFile.name).toEqual(mockFile.name)
    expect(component.csvForm.valid).toBeTrue()
    expect(spyValidateCsv).toHaveBeenCalled()
    expect(spyShowModal).toHaveBeenCalled()
    expect(fileServiceSpy).toHaveBeenCalled()
    done()
  })

  it('should filter users by param', (done: DoneFn) => {
    const userServiceSpy = spyOn(userService, 'getUsers')
    userServiceSpy.and.returnValue(of(mockGetUsersWithParamResponse))

    component.filterForm.setValue({
      parameter: 'Ana'
    })
    component.filter()

    expect(userServiceSpy).toHaveBeenCalled()
    expect(userServiceSpy).toHaveBeenCalledWith('Ana')
    done()
  })

  it('should show modal', (done: DoneFn) => {
    const title = 'Título de prueba'
    const message = 'Mensaje de prueba'

    component.showModal(title, message) // Recuerda que los spyOn vacian la función a espiar

    expect(component.modalTitle).toEqual(title)
    expect(component.modalMessage).toEqual(message)
    done()
  })
});
