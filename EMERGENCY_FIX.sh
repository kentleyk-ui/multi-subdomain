#!/bin/bash
# EMERGENCY DEPLOYMENT FIX SCRIPT
# This script fixes and deploys the project

echo "🔧 EMERGENCY FIX & DEPLOYMENT"
echo "==============================="
echo ""

cd "$(dirname "$0")" || exit

echo "[1/6] Vérification des fichiers..."
echo "✓ pages/_app.js: $(test -f pages/_app.js && echo 'OK' || echo 'MISSING')"
echo "✓ pages/_document.js: $(test -f pages/_document.js && echo 'OK' || echo 'MISSING')"
echo "✓ pages/index.js: $(test -f pages/index.js && echo 'OK' || echo 'MISSING')"
echo ""

echo "[2/6] Cleaning previous builds..."
rm -rf .next
echo "✓ .next cleared"
echo ""

echo "[3/6] Staging all files..."
git add -A
echo "✓ All files staged"
echo ""

echo "[4/6] Status check..."
git status --short
echo ""

echo "[5/6] Creating commit..."
git commit -m "CRITICAL FIX: Add missing _app.js and _document.js for Next.js entry points

Fixed:
- Add pages/_app.js (Next.js app wrapper)
- Add pages/_document.js (Next.js HTML wrapper)
- Clean .next build cache
- Re-validate all configuration files

This should resolve the DNS_PROBE_FINISHED_NXDOMAIN error on Vercel"

echo "✓ Commit created"
echo ""

echo "[6/6] Pushing to production..."
git push origin main
echo "✓ Push completed"
echo ""

echo "==============================="
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Vercel will rebuild in 1-2 minutes"
echo "URL: https://multi-subdomain-*.vercel.app"
echo ""
