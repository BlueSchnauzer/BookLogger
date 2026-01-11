// General variables for ECS module
variable "aws_region" {
  type = string
}

variable "appname" {
  type = string
}

variable "environment" {
  type = string
}

//ECS Task Definition variables
variable "cpu" {
  type = number
}

variable "memory" {
  type = number
}

variable "execution_role_arn" {
  type = string
}

variable "image_name" {
  type = string
}

variable "image_version" {
  type = string
}

variable "container_name" {
  type = string
}

// Load Balancer variables
variable "subnet_ids" {
  type = list(string)
}

variable "lb_security_group_ids" {
  type = list(string)
}

variable "lb_access_logs_bucket" {
  type = string
}

//Load Balancer Target Group variables
variable "container_port" {
  type = number
}

variable "vpc_id" {
  type = string
}

variable "container_health_port" {
  type = string
}

// Load Balancer Listener variables
variable "lb_listener_port" {
  type = number
}

variable "lb_listener_protocol" {
  type = string
}

variable "lb_ssl_policy" {
  type = string
}

variable "lb_certificate_arn" {
  type = string
}

// ECS Service variables
variable "desired_count" {
  type = number
}

// Route53 variables
variable "lb_host_zone" {
  type = string
}
variable "lb_sub_domain" {
  type = string
}

//

variable "host_port" {
  type = number
}


variable "security_group_ids" {
  type = list(string)
}

variable "assign_public_ip" {
  type = bool
}

variable "lb_is_public" {
  type = bool
}

