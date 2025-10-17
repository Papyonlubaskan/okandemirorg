-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "communicationRating" INTEGER NOT NULL,
    "qualityRating" INTEGER NOT NULL,
    "timelinessRating" INTEGER NOT NULL,
    "valueRating" INTEGER NOT NULL,
    "whatWorkedWell" TEXT,
    "whatCouldImprove" TEXT,
    "wouldRecommend" BOOLEAN NOT NULL,
    "testimonial" TEXT,
    "allowPublic" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT
);

-- CreateTable
CREATE TABLE "SurveyInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "projectId" TEXT,
    "token" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "reminderSentAt" DATETIME
);

-- CreateIndex
CREATE INDEX "Survey_customerEmail_idx" ON "Survey"("customerEmail");

-- CreateIndex
CREATE INDEX "Survey_overallRating_idx" ON "Survey"("overallRating");

-- CreateIndex
CREATE INDEX "Survey_completedAt_idx" ON "Survey"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyInvitation_token_key" ON "SurveyInvitation"("token");

-- CreateIndex
CREATE INDEX "SurveyInvitation_customerEmail_idx" ON "SurveyInvitation"("customerEmail");

-- CreateIndex
CREATE INDEX "SurveyInvitation_token_idx" ON "SurveyInvitation"("token");
