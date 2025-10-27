variable "appname" {
  description = "The name of the application"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., development, staging, production)"
  type        = string
}

variable "region" {
  description = "The AWS region to deploy the resources in"
  type = string
  default = "ap-northeast-1"
}