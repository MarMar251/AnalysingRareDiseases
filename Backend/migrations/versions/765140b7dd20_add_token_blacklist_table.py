"""add token_blacklist table

Revision ID: 765140b7dd20
Revises:
Create Date: 2025-07-12 02:37:33.602592
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# ─── معرفات الهجرة ────────────────────────────────────────────
revision: str = "765140b7dd20"
down_revision: str | None = None
branch_labels = depends_on = None

# ─── upgrade ─────────────────────────────────────────────────
def upgrade() -> None:
    # 1) تأكيد وجود ENUM
    user_role_enum = postgresql.ENUM(
        "admin", "doctor", "nurse", name="user_role"
    )
    user_role_enum.create(op.get_bind(), checkfirst=True)

    # 2) تعديل عمود role
    op.alter_column(
        "users",
        "role",
        existing_type=postgresql.ENUM(
            "admin", "doctor", "nurse", name="userrole"
        ),
        type_=user_role_enum,
        existing_nullable=False,
        postgresql_using="role::text::user_role",
    )

    # 3) إنشاء جدول البلاك-ليست
    op.create_table(
        "token_blacklist",
        sa.Column("jti", sa.String(length=64), primary_key=True),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
    )

# ─── downgrade ───────────────────────────────────────────────
def downgrade() -> None:
    op.drop_table("token_blacklist")

    old_enum = postgresql.ENUM(
        "admin", "doctor", "nurse", name="userrole"
    )
    op.alter_column(
        "users",
        "role",
        existing_type=sa.Enum("admin", "doctor", "nurse", name="user_role"),
        type_=old_enum,
        existing_nullable=False,
        postgresql_using="role::text::userrole",
    )

    user_role_enum = postgresql.ENUM(
        "admin", "doctor", "nurse", name="user_role"
    )
    user_role_enum.drop(op.get_bind(), checkfirst=True)
