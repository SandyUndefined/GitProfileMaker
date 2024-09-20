import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const {
    username,
    templateId,
    name,
    bio,
    repos,
    followers,
    following,
    languages,
    repoList,
  } = req.query;

  const templatesDir = path.resolve("./readme-templates");
  const templatePath = path.join(templatesDir, `template${templateId}.md`);

  // Read the template file
  let template = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders with user data
  template = template
    .replace("{name}", name)
    .replace("{bio}", bio)
    .replace("{repos}", repos)
    .replace("{followers}", followers)
    .replace("{following}", following)
    .replace("{languages}", languages)
    .replace("{repoList}", repoList);

  // Return the populated template
  res.status(200).send(template);
}
