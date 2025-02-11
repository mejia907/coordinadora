import { LoginUserUseCase } from '../../../src/application/useCases/loginUserUseCase';
import UserRepository from '../../../src/infrastructure/repositories/userRepository';
import { AuthEntity } from '../../../src/entities/authEntity';

// Mockear el UserRepository
jest.mock('../../../src/infrastructure/repositories/userRepository');

describe('LoginUserUseCase', () => {
  let loginUserUseCase: typeof LoginUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Inicializar el mock del UserRepository con todos los métodos
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      comparePassword: jest.fn(),
      login: jest.fn(),
    } as jest.Mocked<UserRepository>;

    // Sobrescribir la implementación del UserRepository con el mock
    (UserRepository as jest.Mock).mockImplementation(() => mockUserRepository);

    loginUserUseCase = LoginUserUseCase;
  });

  it('debería devolver AuthEntity cuando el inicio de sesión sea exitoso', async () => {
    const mockAuthEntity: AuthEntity = {
      token: 'toke-coordinadora',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        type_document: 'CC',
        document: '123456789',
        phone: '1234567890',
        address: 'Calle 123',
        role_id: 1,
        status: true,
        password: 'hashedPassword', 
        created_at: new Date(), 
      },
    };

    // Configurar el mock para devolver mockAuthEntity
    mockUserRepository.login.mockResolvedValue(mockAuthEntity);

    const result = await loginUserUseCase('test@coordinadora.com', 'password123');

    // Verificar que el método login fue llamado con los argumentos correctos
    expect(mockUserRepository.login).toHaveBeenCalledWith('test@coordinadora.com', 'password123');
    // Verificar que el resultado es el esperado
    expect(result).toEqual(mockAuthEntity);
  });

  it('debería arrojar un error cuando falla el inicio de sesión', async () => {
    // Configurar el mock para lanzar un error
    mockUserRepository.login.mockRejectedValue(new Error('El usuario no existe.'));

    // Verificar que el caso de uso lanza el error esperado
    await expect(loginUserUseCase('tests@coordinadora.com', 'wrongpassword')).rejects.toThrow(
      'El usuario no existe.'
    );
  });
});