#!/bin/bash

IS_MATCHED=true

echo ""
echo "🔍 shared-types 비교 중..."
if ! diff -r --ignore-blank-lines --ignore-space-change ./shared-types ../farmsns-tablet-webview/shared-types; then
  echo "❌ types 폴더 내용이 다릅니다!"
  IS_MATCHED=false
else
  echo "✅ types 폴더는 일치합니다."
fi

echo ""
echo "🔍 shared-utils 비교 중..."
if ! diff -r --ignore-blank-lines --ignore-space-change ./shared-utils ../farmsns-tablet-webview/shared-utils; then
  echo "❌ utils 폴더 내용이 다릅니다!"
  IS_MATCHED=false
else
  echo "✅ utils 폴더는 일치합니다."
fi

echo ""
echo "🔍 shared-constants 비교 중..."
if ! diff -r --ignore-blank-lines --ignore-space-change ./shared-constants ../farmsns-tablet-webview/shared-constants; then
  echo "❌ constants 폴더 내용이 다릅니다!"
  IS_MATCHED=false
else
  echo "✅ constants 폴더는 일치합니다."
fi

echo ""
echo "🔍 services 비교 중..."
if ! diff -r --ignore-blank-lines --ignore-space-change ./services ../farmsns-tablet-webview/services; then
  echo "❌ services 폴더 내용이 다릅니다!"
  IS_MATCHED=false
else
  echo "✅ services 폴더는 일치합니다."
fi

if [ "$IS_MATCHED" = false ]; then
  echo ""
  echo "🚨 하나 이상의 폴더가 일치하지 않습니다. 위 내용을 확인하세요."
  exit 1
else
  echo ""
  echo "✅ 모든 shared 폴더가 완전히 일치합니다!"
fi
