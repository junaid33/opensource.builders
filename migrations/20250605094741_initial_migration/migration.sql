-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "role" TEXT,

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
    "canManageTools" BOOLEAN NOT NULL DEFAULT false,
    "canManageCategories" BOOLEAN NOT NULL DEFAULT false,
    "canManageFeatures" BOOLEAN NOT NULL DEFAULT false,
    "canManageAlternatives" BOOLEAN NOT NULL DEFAULT false,
    "canManageDeploymentOptions" BOOLEAN NOT NULL DEFAULT false,
    "canManageTechStacks" BOOLEAN NOT NULL DEFAULT false,
    "canManageFlows" BOOLEAN NOT NULL DEFAULT false,

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
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "repositoryUrl" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "isOpenSource" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "license" TEXT NOT NULL DEFAULT '',
    "githubStars" INTEGER,
    "status" TEXT DEFAULT 'active',
    "pricingModel" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "featureType" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolFeature" (
    "id" TEXT NOT NULL,
    "tool" TEXT,
    "feature" TEXT,
    "implementationNotes" TEXT NOT NULL DEFAULT '',
    "qualityScore" INTEGER,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alternative" (
    "id" TEXT NOT NULL,
    "proprietaryTool" TEXT,
    "openSourceTool" TEXT,
    "similarityScore" DECIMAL(3,2),
    "matchType" TEXT,
    "comparisonNotes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeploymentOption" (
    "id" TEXT NOT NULL,
    "tool" TEXT,
    "platform" TEXT NOT NULL DEFAULT '',
    "deployUrl" TEXT NOT NULL DEFAULT '',
    "templateUrl" TEXT NOT NULL DEFAULT '',
    "difficulty" TEXT,
    "estimatedTime" TEXT NOT NULL DEFAULT '',
    "requirements" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeploymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "type" TEXT,
    "color" TEXT NOT NULL DEFAULT '',
    "iconUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "TechStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolTechStack" (
    "id" TEXT NOT NULL,
    "tool" TEXT,
    "techStack" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ToolTechStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "steps" JSONB,
    "userPersona" TEXT NOT NULL DEFAULT '',
    "difficulty" TEXT,
    "estimatedTime" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolFlow" (
    "id" TEXT NOT NULL,
    "tool" TEXT,
    "flow" TEXT,
    "implementationNotes" TEXT NOT NULL DEFAULT '',
    "easeOfUseScore" INTEGER,
    "stepsRequired" INTEGER,
    "requiresPlugins" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolFlow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");

-- CreateIndex
CREATE INDEX "Tool_category_idx" ON "Tool"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_slug_key" ON "Feature"("slug");

-- CreateIndex
CREATE INDEX "Feature_category_idx" ON "Feature"("category");

-- CreateIndex
CREATE INDEX "ToolFeature_tool_idx" ON "ToolFeature"("tool");

-- CreateIndex
CREATE INDEX "ToolFeature_feature_idx" ON "ToolFeature"("feature");

-- CreateIndex
CREATE INDEX "Alternative_proprietaryTool_idx" ON "Alternative"("proprietaryTool");

-- CreateIndex
CREATE INDEX "Alternative_openSourceTool_idx" ON "Alternative"("openSourceTool");

-- CreateIndex
CREATE INDEX "DeploymentOption_tool_idx" ON "DeploymentOption"("tool");

-- CreateIndex
CREATE INDEX "ToolTechStack_tool_idx" ON "ToolTechStack"("tool");

-- CreateIndex
CREATE INDEX "ToolTechStack_techStack_idx" ON "ToolTechStack"("techStack");

-- CreateIndex
CREATE UNIQUE INDEX "Flow_slug_key" ON "Flow"("slug");

-- CreateIndex
CREATE INDEX "Flow_category_idx" ON "Flow"("category");

-- CreateIndex
CREATE INDEX "ToolFlow_tool_idx" ON "ToolFlow"("tool");

-- CreateIndex
CREATE INDEX "ToolFlow_flow_idx" ON "ToolFlow"("flow");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolFeature" ADD CONSTRAINT "ToolFeature_tool_fkey" FOREIGN KEY ("tool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolFeature" ADD CONSTRAINT "ToolFeature_feature_fkey" FOREIGN KEY ("feature") REFERENCES "Feature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alternative" ADD CONSTRAINT "Alternative_proprietaryTool_fkey" FOREIGN KEY ("proprietaryTool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alternative" ADD CONSTRAINT "Alternative_openSourceTool_fkey" FOREIGN KEY ("openSourceTool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeploymentOption" ADD CONSTRAINT "DeploymentOption_tool_fkey" FOREIGN KEY ("tool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTechStack" ADD CONSTRAINT "ToolTechStack_tool_fkey" FOREIGN KEY ("tool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTechStack" ADD CONSTRAINT "ToolTechStack_techStack_fkey" FOREIGN KEY ("techStack") REFERENCES "TechStack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolFlow" ADD CONSTRAINT "ToolFlow_tool_fkey" FOREIGN KEY ("tool") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolFlow" ADD CONSTRAINT "ToolFlow_flow_fkey" FOREIGN KEY ("flow") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
