resource "aws_ecs_task_definition" "this" {
  family                = "${var.appname}-${var.environment}"
  container_definitions = jsondecode("")
    
  tags = {
    Application = var.appname
    Environment = var.environment
  }
}