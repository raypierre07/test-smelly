const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Refatorada (Clean Code)', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // Teste 1: Focado apenas na criação
  test('deve atribuir um ID válido ao criar um novo usuário', () => {
    // Arrange
    const nome = 'Fulano de Tal';
    const email = 'fulano@teste.com';
    const idade = 25;

    // Act
    const usuario = userService.createUser(nome, email, idade);

    // Assert
    expect(usuario.id).toBeDefined();
    expect(typeof usuario.id).toBe('string');
  });

  // Teste 2: Focado na busca 
  test('deve recuperar os dados corretos de um usuário pelo ID', () => {
    // Arrange
    const usuarioCriado = userService.createUser('Fulano', 'fulano@teste.com', 25);

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado.nome).toBe('Fulano');
    expect(usuarioBuscado.status).toBe('ativo');
  });

  // Teste 3: Removida lógica condicional 
  test('deve alterar o status para inativo ao desativar um usuário comum', () => {
    // Arrange
    const usuario = userService.createUser('Comum', 'comum@teste.com', 30, false);

    // Act
    const resultado = userService.deactivateUser(usuario.id);
    const usuarioAtualizado = userService.getUserById(usuario.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  // Teste 4: Removida lógica condicional 
  test('não deve permitir a desativação de um usuário administrador', () => {
    // Arrange
    const admin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(admin.id);
    const adminAtualizado = userService.getUserById(admin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(adminAtualizado.status).toBe('ativo');
  });

  // Teste 5: Refatorado para evitar fragilidade 
  test('deve incluir os dados do usuário no relatório gerado', () => {
    // Arrange
    const usuario = userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain(usuario.id.toString());
    expect(relatorio).toContain('ativo');
  });

  // Teste 6: Removido Try/Catch 
  test('deve lançar exceção ao tentar cadastrar usuário menor de idade', () => {
    // Arrange
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    // Act & Assert
    expect(() => {
      userService.createUser(nome, email, idade);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  // Teste 7: Implementado 
  test('deve retornar mensagem informativa quando o relatório for gerado sem usuários', () => {
    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toBe('--- Relatório de Usuários ---\nNenhum usuário cadastrado.');
  });
});