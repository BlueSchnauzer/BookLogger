variable "aws_region" {
  type = string
}

variable "appname" {
  type = string
}

variable "environment" {
  type = string
}

variable "image_name" {
  type = string
}

variable "image_version" {
  type = string
}

variable "cpu" {
  type = number
}

variable "memory" {
  type = number
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

variable "security_group_ids" {
  type = list(string)
}

variable "assign_public_ip" {
  type = bool
}

variable "lb_security_group_ids" {
  type = list(string)
}
