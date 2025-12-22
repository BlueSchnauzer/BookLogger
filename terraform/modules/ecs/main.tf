# https://registry.terraform.io/providers/hashicorp/aws/6.7.0/docs/resources/ecs_cluster
resource "aws_ecs_cluster" "this" {
  name = local.name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition
resource "aws_ecs_task_definition" "this" {
  family = local.name
  container_definitions = jsondecode([{
    name      = local.name
    image     = "${var.image_name}:${var.image_version}"
    cpu       = var.cpu
    memory    = var.memory
    essential = true
    portMappings = [{
      containerPort = var.container_port
      hostPort      = var.host_port
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${local.name}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service
resource "aws_ecs_service" "this" {
  name            = local.name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = var.security_group_ids
    assign_public_ip = var.assign_public_ip
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb
resource "aws_lb" "this" {
  name               = local.name
  internal           = false
  load_balancer_type = "application"
  security_groups    = var.lb_security_group_ids
  subnets            = var.subnet_ids
}

resource "aws_lb_listener" "this" {
  load_balancer_arn = aws_lb.this.arn
  port              = var.lb_listener_port
  protocol          = var.lb_listener_protocol

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group
resource "aws_lb_target_group" "this" {
  name     = local.name
  port     = var.container_port
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/health-check"
    interval            = 15
    timeout             = 10
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

