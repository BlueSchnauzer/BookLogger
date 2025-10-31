# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository
resource "aws_ecr_repository" "this" {
  name = "${var.appname}-${var.environment}"

  image_tag_mutability = "MUTABLE"

  tags = {
    Application = var.appname
    Environment = var.environment
  }
}