import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { templateId } = req.query;

  const templatesDir = path.resolve("./readme-templates");
  const templatePath = path.join(
    templatesDir,
    `template${templateId}-preview.md`
  );

  try {
    // Read the template preview file
    const template = fs.readFileSync(templatePath, "utf8");
    res.status(200).send(template);
  } catch (error) {
    res.status(404).json({ error: "Template not found" });
  }
}
