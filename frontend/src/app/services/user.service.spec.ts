import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Apiresponse } from '../entities/apiresponse';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController // Controlador para mockear peticiones, para simularlas, no API real
  const baseUrl = 'http://localhost:3000/api/users' // Url que simulamos

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTestingController.verify() // Nos aseguramos de que no se ejecute otra petición http pendiente mientras se realiza un test
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users with no param', () => {
    const MockResponse = {
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

    service.getUsers().subscribe((response: Apiresponse) => {
      expect(response).toBeTruthy()
      expect(response.data).toHaveSize(2)
      expect(response.data).toEqual(MockResponse.data)
      expect(response.data?.find(user => user.nombre === "Ana")?.ciudad).toBe("Madrid")
    })

    const mockRequest = httpTestingController.expectOne(baseUrl) // Hacemos la petición
    expect(mockRequest.request.method).toEqual('GET')
    expect(mockRequest.request.url).toBe(baseUrl)

    // flush debe ir siempre después de la suscripción al método del servicio, ya que éste espera resolver la petición, la cual no lo
    // hace porque es simulada con provideHttpClientTesting y HttpTestingController. Sin el flush, la petición se queda esperando
    // para siempre.
    mockRequest.flush(MockResponse)

  })

  it('should get users by param', () => {
    const MockResponse = {
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

    const parameter = "Ana"

    service.getUsers(parameter).subscribe((response: Apiresponse) => {
      expect(response).toBeTruthy()
      expect(response.data).toHaveSize(1)
      expect(response.data).toEqual(MockResponse.data)
      expect(response.data?.find(user => user.nombre === "Ana")?.ciudad).toBe("Madrid")
    })

    const mockRequest = httpTestingController.expectOne(`${baseUrl}?q=${parameter.toLowerCase()}`) // Hacemos la petición
    expect(mockRequest.request.method).toEqual('GET')
    expect(mockRequest.request.urlWithParams).toEqual(`${baseUrl}?q=${parameter.toLowerCase()}`) // request.url no incluye params

    mockRequest.flush(MockResponse)
  })

});
