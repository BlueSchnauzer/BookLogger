# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository
resource "aws_ecr_repository" "this" {
  name = "${var.appname}-${var.environment}"

  image_tag_mutability = "MUTABLE"

  //要チェック
  image_scanning_configuration {
    scan_on_push = true
  }
}
