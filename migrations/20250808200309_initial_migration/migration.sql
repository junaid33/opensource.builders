-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "role" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetIssuedAt" TIMESTAMP(3),
    "passwordResetRedeemedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "canSeeOtherPeople" BOOLEAN NOT NULL DEFAULT false,
    "canEditOtherPeople" BOOLEAN NOT NULL DEFAULT false,
    "canManagePeople" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,
    "canAccessDashboard" BOOLEAN NOT NULL DEFAULT false,
    "canManageApplications" BOOLEAN NOT NULL DEFAULT false,
    "canManageCategories" BOOLEAN NOT NULL DEFAULT false,
    "canManageCapabilities" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProprietaryApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "simpleIconSlug" TEXT NOT NULL DEFAULT '',
    "simpleIconColor" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProprietaryApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenSourceApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "primaryAlternativeTo" TEXT,
    "repositoryUrl" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "simpleIconSlug" TEXT NOT NULL DEFAULT '',
    "simpleIconColor" TEXT NOT NULL DEFAULT '',
    "license" TEXT NOT NULL DEFAULT '',
    "githubStars" INTEGER,
    "githubForks" INTEGER,
    "githubIssues" INTEGER,
    "githubLastCommit" TIMESTAMP(3),
    "status" TEXT DEFAULT 'active',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenSourceApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capability" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "complexity" TEXT DEFAULT 'intermediate',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProprietaryCapability" (
    "id" TEXT NOT NULL,
    "proprietaryApplication" TEXT,
    "capability" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProprietaryCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenSourceCapability" (
    "id" TEXT NOT NULL,
    "openSourceApplication" TEXT,
    "capability" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "implementationNotes" TEXT NOT NULL DEFAULT '',
    "githubPath" TEXT NOT NULL DEFAULT '',
    "documentationUrl" TEXT NOT NULL DEFAULT '',
    "implementationComplexity" TEXT DEFAULT 'intermediate',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenSourceCapability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProprietaryApplication_slug_key" ON "ProprietaryApplication"("slug");

-- CreateIndex
CREATE INDEX "ProprietaryApplication_category_idx" ON "ProprietaryApplication"("category");

-- CreateIndex
CREATE UNIQUE INDEX "OpenSourceApplication_slug_key" ON "OpenSourceApplication"("slug");

-- CreateIndex
CREATE INDEX "OpenSourceApplication_primaryAlternativeTo_idx" ON "OpenSourceApplication"("primaryAlternativeTo");

-- CreateIndex
CREATE UNIQUE INDEX "Capability_slug_key" ON "Capability"("slug");

-- CreateIndex
CREATE INDEX "ProprietaryCapability_proprietaryApplication_idx" ON "ProprietaryCapability"("proprietaryApplication");

-- CreateIndex
CREATE INDEX "ProprietaryCapability_capability_idx" ON "ProprietaryCapability"("capability");

-- CreateIndex
CREATE INDEX "OpenSourceCapability_openSourceApplication_idx" ON "OpenSourceCapability"("openSourceApplication");

-- CreateIndex
CREATE INDEX "OpenSourceCapability_capability_idx" ON "OpenSourceCapability"("capability");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProprietaryApplication" ADD CONSTRAINT "ProprietaryApplication_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenSourceApplication" ADD CONSTRAINT "OpenSourceApplication_primaryAlternativeTo_fkey" FOREIGN KEY ("primaryAlternativeTo") REFERENCES "ProprietaryApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProprietaryCapability" ADD CONSTRAINT "ProprietaryCapability_proprietaryApplication_fkey" FOREIGN KEY ("proprietaryApplication") REFERENCES "ProprietaryApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProprietaryCapability" ADD CONSTRAINT "ProprietaryCapability_capability_fkey" FOREIGN KEY ("capability") REFERENCES "Capability"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenSourceCapability" ADD CONSTRAINT "OpenSourceCapability_openSourceApplication_fkey" FOREIGN KEY ("openSourceApplication") REFERENCES "OpenSourceApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenSourceCapability" ADD CONSTRAINT "OpenSourceCapability_capability_fkey" FOREIGN KEY ("capability") REFERENCES "Capability"("id") ON DELETE SET NULL ON UPDATE CASCADE;
