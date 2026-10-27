using FluentResults;
using MediatR;
using NoteKeeper.Aplicacao.Compartilhado;
using NoteKeeper.Dominio.Compartilhado;

namespace NoteKeeper.Aplicacao.Modulos.Auth;

public sealed record CadastrarUsuarioCommand(string? Nome, string? Email, string? Senha)
    : IRequest<Result<UsuarioDto>>;

public sealed class CadastrarUsuarioCommandHandler(IGerenciadorIdentidade identidade)
    : IRequestHandler<CadastrarUsuarioCommand, Result<UsuarioDto>>
{
    public async Task<Result<UsuarioDto>> Handle(CadastrarUsuarioCommand command, CancellationToken ct)
    {
        var erros = new List<Error>();

        if (string.IsNullOrWhiteSpace(command.Nome))
        {
            erros.Add(Erros.Criar(TipoErro.Validacao, "Name is required.", "nome"));
        }

        if (string.IsNullOrWhiteSpace(command.Email)
            || !new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(command.Email))
        {
            erros.Add(Erros.Criar(TipoErro.Validacao, "Enter a valid email address.", "email"));
        }

        if (string.IsNullOrEmpty(command.Senha)
            || command.Senha.Length < 8
            || !command.Senha.Any(char.IsDigit)
            || !command.Senha.Any(caractere => !char.IsLetterOrDigit(caractere)))
        {
            erros.Add(Erros.Criar(
                TipoErro.Validacao,
                "Password must be at least 8 characters long, including a number and a special character.",
                "senha"));
        }

        if (erros.Count > 0)
        {
            return Result.Fail<UsuarioDto>(erros);
        }

        try
        {
            var usuario = await identidade.CadastrarAsync(
                command.Nome!,
                command.Email!,
                command.Senha!,
                ct);

            return Result.Ok(usuario);
        }
        catch (InvalidOperationException ex) when (ex.Message == "EMAIL_DUPLICADO")
        {
            return Result.Fail<UsuarioDto>(
                Erros.Criar(TipoErro.Conflito, "Email is already registered.", "email"));
        }
        catch (ArgumentException ex)
        {
            return Result.Fail<UsuarioDto>(Erros.Criar(TipoErro.Validacao, ex.Message, "senha"));
        }
    }
}
