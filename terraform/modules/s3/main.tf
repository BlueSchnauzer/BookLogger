resource "aws_s3_bucket" "this" {
  bucket = var.name
  count  = var.create_bucket ? 1 : 0
}

resource "aws_s3_bucket_owner_controls" "this" {
  bucket = aws_s3_bucket.this[0].id
  count  = var.create_bucket ? 1 : 0

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this[0].id
  count  = var.create_bucket ? 1 : 0

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this[0].id
  count  = var.create_bucket ? 1 : 0

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this[0].id
  count  = var.create_bucket ? 1 : 0

  policy = var.bucket_policy //この設定はmainで定義
}

data "aws_s3_bucket" "this" {
  bucket = aws_s3_bucket.this[0].bucket
  count  = var.create_bucket ? 0 : 1 //逆でOK？
}
