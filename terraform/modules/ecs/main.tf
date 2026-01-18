# https://registry.terraform.io/providers/hashicorp/aws/6.7.0/docs/resources/ecs_cluster
resource "aws_ecs_cluster" "this" {
  name = local.name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

//クラスターを別ファイルのecsに分けて、それ以外をecs_serviceにまとめる


# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition
resource "aws_ecs_task_definition" "this" {
  family = local.name

  //要チェック
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.execution_role_arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsondecode([{
    name      = local.name
    image     = "${var.image_name}:${var.image_version}"
    cpu       = var.cpu
    memory    = var.memory
    essential = true
    portMappings = [{
      name          = "${var.container_name}-${var.container_port}-tcp" //要チェック
      containerPort = var.container_port
      hostPort      = var.host_port
      //要チェック
      protocol    = "tcp"
      appProtocol = "HTTP"
    }]
    environment       = []
    environtmentFiles = []
    mountPoints       = []
    volumesFrom       = []
    secrets           = []
    ulimits           = [] //要チェック
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${local.name}"
        "mode"                  = "non-blocking"
        "awslogs-create-group"  = "true"
        "maximum-buffer-size"   = "4MB"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb
resource "aws_lb" "this" {
  name               = local.name
  internal           = false //環境に応じて切り替える？
  load_balancer_type = "application"
  security_groups    = var.lb_security_group_ids
  subnets            = var.subnet_ids

  enable_deletion_protection = false

  access_logs {
    bucket  = var.lb_access_logs_bucket
    prefix  = local.name
    enabled = true
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group
resource "aws_lb_target_group" "this" {
  name        = local.name
  target_type = "ip"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/health-check"
    port                = var.container_health_port
    interval            = 15
    timeout             = 10
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = 200
  }

  //要チェック
  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_lb_listener" "this" {
  load_balancer_arn = aws_lb.this.arn
  port              = var.lb_listener_port
  protocol          = var.lb_listener_protocol
  ssl_policy        = var.lb_ssl_policy
  certificate_arn   = var.lb_certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "404: page not found"
      status_code  = "404"
    }
  }

  //要チェック
  lifecycle {
    ignore_changes = [default_action]
  }
}

//要チェック
resource "aws_lb_listener_rule" "this" {
  listener_arn = aws_lb_listener.this.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }

  lifecycle {
    ignore_changes = [action]
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service
resource "aws_ecs_service" "this" {
  name            = local.name
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  //要チェック
  health_check_grace_period_seconds = 360
  propagate_tags                    = "SERVICE"
  platform_version                  = "1.4.0"

  deployment_controller {
    type = "ECS"
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = local.name
    container_port   = var.container_port
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = var.security_group_ids
    assign_public_ip = false
  }

  depends_on = [aws_lb.this, aws_lb_target_group.this, aws_lb_listener.this, aws_lb_listener_rule.this]
}


//別ファイルにしない方が良い？
resource "aws_route53_record" "this" {
  zone_id = var.lb_host_zone
  name    = var.lb_sub_domain
  type    = "CNAME"
  ttl     = 300
  records = [aws_lb.this.dns_name]
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${local.name}"
  retention_in_days = 14 //こんなに要らない
}
