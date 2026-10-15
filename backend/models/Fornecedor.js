module.exports = (sequelize, DataTypes) => {
  const Fornecedor = sequelize.define(
    "Fornecedor",
    {
      nomeEmpresa: { type: DataTypes.STRING, allowNull: false },
      cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
      endereco: { type: DataTypes.TEXT, allowNull: false },
      telefone: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      contatoPrincipal: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "fornecedores",
      timestamps: true,
    }
  );

  Fornecedor.associate = (models) => {
    Fornecedor.belongsToMany(models.Produto, {
      through: "FornecedorProduto",
      foreignKey: "fornecedorId",
      otherKey: "produtoId",
      as: "produtos",
    });
  };

  return Fornecedor;
};