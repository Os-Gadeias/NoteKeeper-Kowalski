using FluentResults;
using MediatR;
using NoteKeeper.Aplicacao.Compartilhado;
using NoteKeeper.Dominio.Compartilhado;
using NoteKeeper.Dominio.Modulos.Categorias;

namespace NoteKeeper.Aplicacao.Modulos.Categorias;

public sealed record ExcluirCategoriaCommand(Guid UsuarioId, Guid Id) : IRequest<Result>;

public sealed class ExcluirCategoriaCommandHandler(IRepositorioCategoria repositorio)
    : IRequestHandler<ExcluirCategoriaCommand, Result>
{
    public async Task<Result> Handle(ExcluirCategoriaCommand command, CancellationToken ct)
    {
        var categoria = await repositorio.ObterAsync(command.Id, command.UsuarioId, ct);
        if (categoria is null)
        {
            return Result.Fail(Erros.Criar(TipoErro.NaoEncontrado, "Category not found."));
        }

        // Impede a exclusão de categorias que ainda estão vinculadas a notas.
        if (await repositorio.PossuiNotasAsync(categoria.Id, command.UsuarioId, ct))
        {
            return Result.Fail(
                Erros.Criar(TipoErro.Conflito, "This category is linked to a note and cannot be deleted."));
        }

        await repositorio.ExcluirAsync(categoria, ct);

        return Result.Ok();
    }
}
