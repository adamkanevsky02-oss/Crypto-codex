import {defineConfig} from '@trigger.dev/sdk';
import {additionalFiles,aptGet} from '@trigger.dev/build/extensions/core';

export default defineConfig({
  project:process.env.TRIGGER_PROJECT_REF||'configure-project-before-deployment',
  dirs:['./src/trigger'],runtime:'node',maxDuration:3600,
  retries:{enabledInDev:false,default:{maxAttempts:3,factor:2,minTimeoutInMs:1000,maxTimeoutInMs:30000,randomize:true}},
  build:{extensions:[aptGet({packages:['python3']}),additionalFiles({files:['./.claude/skills/humaniser/scripts/check.py']})]},
});
