# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition
resource "aws_ecs_task_definition" "this" {
  family = "${var.appname}-${var.environment}"
  container_definitions = jsondecode([{
    name      = var.appname
    image     = "${var.image_name}:${var.image_version}"
    cpu       = var.cpu
    memory    = var.memory
    essential = true
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${var.appname}-${var.environment}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = {
    Application = var.appname
    Environment = var.environment
  }
}
