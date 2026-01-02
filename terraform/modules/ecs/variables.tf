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

variable "container_name" {
  type = string
}

//
variable "image_name" {
  type = string
}

variable "image_version" {
  type = string
}

variable "container_port" {
  type = number
}

variable "host_port" {
  type = number
}

variable "desired_count" {
  type = number
}

variable "subnet_ids" {
  type = list(string)
}

variable "lb_access_logs_bucket" {
  type = string
}

variable "security_group_ids" {
  type = list(string)
}

variable "assign_public_ip" {
  type = bool
}

variable "lb_security_group_ids" {
  type = list(string)
}

variable "lb_is_public" {
  type = bool
}

variable "lb_listener_port" {
  type = number
}

variable "lb_listener_protocol" {
  type = string
}

variable "vpc_id" {
  type = string
}
