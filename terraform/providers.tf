provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Application = var.appname
      Environment = var.environment
    }
  }
}
