import { pool } from "../db.js";

export const generarBackup = async (req, res) => {
  try {
    const schema = "parafacturas";
    const ahora = new Date();
    const fechaArchivo = ahora
      .toISOString()
      .slice(0, 19)
      .replace("T", "_")
      .replace(/:/g, "-");
    const fechaLegible = ahora.toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    });

    let sql = "";
    sql += `-- ============================================================\n`;
    sql += `-- Backup generado: ${fechaLegible}\n`;
    sql += `-- Base de datos: ${schema}\n`;
    sql += `-- ============================================================\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS=0;\n`;
    sql += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
    sql += `SET NAMES utf8mb4;\n\n`;

    const [tables] = await pool.query(`SHOW TABLES FROM \`${schema}\``);
    const tableKey = `Tables_in_${schema}`;

    for (const tableRow of tables) {
      const tableName = tableRow[tableKey];

      // Estructura
      const [[createResult]] = await pool.query(
        `SHOW CREATE TABLE \`${tableName}\``
      );
      const createStatement = createResult["Create Table"];

      sql += `-- ------------------------------------------------------------\n`;
      sql += `-- Estructura de la tabla \`${tableName}\`\n`;
      sql += `-- ------------------------------------------------------------\n\n`;
      sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
      sql += `${createStatement};\n\n`;

      // Datos
      const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);

      if (rows.length > 0) {
        sql += `-- Datos de la tabla \`${tableName}\` (${rows.length} registros)\n\n`;

        for (const row of rows) {
          const values = Object.values(row).map((val) => {
            if (val === null || val === undefined) return "NULL";
            if (typeof val === "number") return val;
            if (val instanceof Date) {
              return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
            }
            // Escapar string
            const escaped = String(val)
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'")
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "\\r")
              .replace(/\0/g, "\\0");
            return `'${escaped}'`;
          });
          sql += `INSERT INTO \`${tableName}\` VALUES (${values.join(", ")});\n`;
        }
        sql += "\n";
      }
    }

    sql += `SET FOREIGN_KEY_CHECKS=1;\n`;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=backup_${fechaArchivo}.sql`
    );
    res.setHeader("Content-Type", "application/sql; charset=utf-8");
    res.send(sql);
  } catch (error) {
    console.error("Error generando backup:", error);
    res.status(500).json({ message: "Error al generar el backup." });
  }
};
