module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define(
    "Produto",
    {
      nome: { type: DataTypes.STRING, allowNull: false },
      codigoBarras: { type: DataTypes.STRING, unique: true, allowNull: true },
      descricao: { type: DataTypes.TEXT, allowNull: false },
      quantidade: { type: DataTypes.INTEGER, defaultValue: 0 },
      categoria: { type: DataTypes.STRING, allowNull: false },
      categoriaOutro: { type: DataTypes.STRING },
      dataValidade: { type: DataTypes.DATEONLY },
      imagem: { type: DataTypes.STRING },
    },
    {
      tableName: "produtos",
      timestamps: true,
    }
  );

  Produto.associate = (models) => {
    Produto.belongsToMany(models.Fornecedor, {
      through: "FornecedorProduto",
      foreignKey: "produtoId",
      otherKey: "fornecedorId",
      as: "fornecedores",
    });
  };

  return Produto;
};