import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { Apiresponse } from '../entities/apiresponse';

describe('FileService', () => {
  let service: FileService;
  let httpTestingController: HttpTestingController // Controlador para mockear peticiones, para simularlas, no API real
  const baseUrl = 'http://localhost:3000/api/files' // Url que simulamos

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FileService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTestingController.verify() // Nos aseguramos de que no se ejecute otra petición http pendiente mientras se realiza un test
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create users', () => {
    const form = new FormData()
    form.append('file', 'example-data.csv')

    const MockResponse = {
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

    service.postCSV(form).subscribe((response: Apiresponse) => {
      expect(response).toBeTruthy()
      expect(response).toEqual(MockResponse) // toEqual para comprobar contenido, toBe para referencia
      expect(response.data![1].email).toEqual('carlos.lopez@email.com')
      expect(response.data).toHaveSize(2)
    })

    const mockRequest = httpTestingController.expectOne(baseUrl) // Hacemos la petición
    expect(mockRequest.request.method).toEqual('POST')
    expect(mockRequest.request.url).toBe(baseUrl)
    expect(mockRequest.request.body).toBe(form)

    // flush debe ir siempre después de la suscripción al método del servicio, ya que éste espera resolver la petición, la cual no lo
    // hace porque es simulada con provideHttpClientTesting y HttpTestingController. Sin el flush, la petición se queda esperando
    // para siempre.
    mockRequest.flush(MockResponse)
  })

  it('should not create users because a 422 error', () => {
    const mockResponse = {
      message: {
        errors: {
          "fecha_inscripcion": {
            "name": "ValidatorError",
            "message": "Path `fecha_inscripcion` is required.",
            "properties": {
              "message": "Path `fecha_inscripcion` is required.",
              "type": "required",
              "path": "fecha_inscripcion"
            },
            "kind": "required",
            "path": "fecha_inscripcion"
          },
          "ciudad": {
            "name": "ValidatorError",
            "message": "Path `ciudad` is required.",
            "properties": {
              "message": "Path `ciudad` is required.",
              "type": "required",
              "path": "ciudad"
            },
            "kind": "required",
            "path": "ciudad"
          },
        }
      }
    }

    const form = new FormData()
    form.append('file', 'example-data.csv')

    service.postCSV(form).subscribe({
      next: fail,
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(422)
        expect(error.statusText).toBe('Validación incorrecta.')
        expect(error.error).toEqual(mockResponse)
        expect(error.error.message.errors.fecha_inscripcion.name).toEqual('ValidatorError')
      }
    })

    const mockRequest = httpTestingController.expectOne(`${baseUrl}`) // Hacemos la petición
    expect(mockRequest.request.method).toEqual('POST')
    expect(mockRequest.request.url).toBe(baseUrl)
    expect(mockRequest.request.body).toBe(form)
    mockRequest.flush(mockResponse, { status: 422, statusText: 'Validación incorrecta.' })
  })

  it('should not create users because a 500 error', () => {
    const mockResponse = {
      message: "Servicio no disponible"
    }

    const form = new FormData()
    form.append('file', 'example-data.csv')

    service.postCSV(form).subscribe({
      next: fail,
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500)
        expect(error.statusText).toBe('Error del servidor.')
        expect(error.error).toEqual(mockResponse)
      }
    })

    const mockRequest = httpTestingController.expectOne(`${baseUrl}`) // Hacemos la petición
    expect(mockRequest.request.method).toEqual('POST')
    expect(mockRequest.request.url).toBe(baseUrl)
    expect(mockRequest.request.body).toBe(form)
    mockRequest.flush(mockResponse, { status: 500, statusText: 'Error del servidor.' })
  })
});
