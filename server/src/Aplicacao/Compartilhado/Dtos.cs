namespace NoteKeeper.Aplicacao.Compartilhado;

public sealed record CategoriaDto(Guid Id, string Titulo, string Icone);

public sealed record NotaDto(
    Guid Id,
    string Titulo,
    string? Descricao,
    string Status,
    IReadOnlyList<CategoriaDto> Categorias,
    DateTimeOffset CriadoEm,
    DateTimeOffset AtualizadoEm
);
