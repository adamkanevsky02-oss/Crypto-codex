const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,BorderStyle,LevelFormat,AlignmentType}=require('docx');
const SERIF='Georgia', SANS='Arial', BLUE='2079C7', GREY='555555';
const NONE={style:BorderStyle.NONE,size:0,color:'FFFFFF'};
const noBorders={top:NONE,bottom:NONE,left:NONE,right:NONE,insideHorizontal:NONE,insideVertical:NONE};
const cellBorders={top:NONE,bottom:NONE,left:NONE,right:NONE};

const P=(children,opts={})=>new Paragraph({spacing:{before:0,after:0,line:264},...opts,children});
const T=(text,o={})=>new TextRun({text,font:SERIF,size:17,...o});
const H2=t=>new Paragraph({spacing:{before:170,after:60},border:{bottom:{style:BorderStyle.SINGLE,size:4,color:'D9D9D9',space:1}},
  children:[new TextRun({text:t.toUpperCase(),bold:true,color:BLUE,font:SANS,size:19,characterSpacing:8})]});
const H2first=t=>{const p=H2(t);return p;};
const title=t=>P([T(t,{bold:true,size:18})],{spacing:{before:90,after:0}});
const meta=t=>P([T(t,{italics:true,color:GREY,size:16})],{spacing:{before:10,after:20}});
const bullet=(runs)=>new Paragraph({numbering:{reference:'bul',level:0},spacing:{before:0,after:10,line:264},children:Array.isArray(runs)?runs:[T(runs)]});
const proj=(name,desc)=>P([T(name,{bold:true}),T(' — '+desc)],{spacing:{before:0,after:70}});

const left=[
  H2first('Experience'),
  title('Equity Research Intern'), meta('CLSA  |  June – July 2026'),
  bullet('Supported analysts on a presentation for private wealth clients diversifying into US markets'),
  bullet('Built out a valuation model for SpaceX with the covering analyst'),
  bullet('Maintained the research spreadsheets and models used across the desk'),
  title('Research Analyst'), meta("Private equity fund (name withheld at the fund's request)  |  Dec 2025 – Present"),
  bullet('Ad-hoc research on industries and sectors of interest to the principals'),
  title('Asset Research'), meta('Worthington Clark  |  Sept 2025 – Present'),
  bullet('Research to identify lost assets for businesses and individuals across Australia'),
  title('Trading Desk Intern'), meta('Ovata Capital Management  |  Dec 2024 – Feb 2025'),
  bullet('Researched equities and macro trends to support investment ideas'),
  bullet('Shadowed portfolio managers; attended the Goldman Sachs APAC Conference'),
  title('Business Development Manager'), meta('HK Sports Clinic Academy  |  Dec 2023 – Feb 2025'),
  bullet('Developed marketing and financial plans for expansion'),
  bullet('Led outreach across youth fitness and wellness segments'),
  H2('Education'),
  title('Bachelor of Economics — Finance & Financial Economics'), meta('University of Sydney  |  2024 – Nov 2026'),
  title('Australian International School, Hong Kong'), meta('HSC  |  2022 – 2023'),
  bullet('1st in Year 11 Economics  ·  Economics Prize (Year 12)'),
  H2('Extracurricular'),
  title('Community Security Volunteer (CSG NSW)'), meta('March 2025 – Present'),
  bullet('One of 55 graduates from 100 recruits, now protecting Sydney synagogues'),
  title('Elite Football'),
  bullet('HK National Youth Teams (U11–U15)  ·  Chelsea Soccer School HK  ·  Brooke House Academy UK'),
];
const right=[
  H2first('Skills'),
  bullet('Excel (Advanced), Financial Modelling, Valuation, Data Analysis, PowerPoint'),
  bullet('Python, SQL, Git, Anthropic API, Claude Code'),
  H2('AI Projects'),
  proj('HSC Accelerator','Education venture run end to end; an agent system turned ad and sales data into five-day scale-or-kill calls. A$194–281/day revenue on A$80/day ad spend.'),
  proj('Agent content pipeline','Six interlocking Claude Code skills running a full content operation. github.com/adamkanevsky02-oss/agent-content-pipeline'),
  proj('Jarvis','Multi-agent system running a wellness brand: three specialists and a Chief of Staff over a shared vault.'),
  proj('AI Usage Coach','CS50x final project. Python/Flask app parsing Claude Code sessions into weekly summaries via the Anthropic API.'),
  H2('Accolades'),
  bullet('Hackathon winner — AI agent dashboard for Bipolar Australia'),
  bullet('1st in Year 11 Economics'),
  bullet('Economics Prize (Year 12)'),
  bullet('Represented Hong Kong at youth level (football)'),
  H2('Languages'),
  bullet('English (native)  ·  Russian (basic)'),
];
const contact=['3/2 Liverpool Street, Rose Bay, NSW 2029','+61 478 355 202','adamkanevsky02@gmail.com','github.com/adamkanevsky02-oss'];
const head=[
  P([new TextRun({text:'Adam Kanevsky',bold:true,font:SERIF,size:52})],{spacing:{before:0,after:60}}),
  P([T('Final-year Economics student at the University of Sydney, graduating November 2026. Equity research at CLSA and trading desk experience at Ovata Capital, alongside a self-taught record of building and shipping AI systems.',{color:'333333'})]),
];
const contactCell=[
  ...contact.map(c=>P([new TextRun({text:c,font:SANS,size:16})],{spacing:{before:0,after:20}})),
  P([new TextRun({text:'Dual citizen: Australia & Hong Kong',font:SANS,size:16,bold:true})],{spacing:{before:0,after:20}}),
  P([new TextRun({text:'DOB: 19 March 2005',font:SANS,size:16})]),
];
const W=10512, L=6650, R=W-L;
const cell=(children,w,m)=>new TableCell({width:{size:w,type:WidthType.DXA},borders:cellBorders,margins:m,children});
const table=(a,b)=>new Table({width:{size:W,type:WidthType.DXA},columnWidths:[L,R],borders:noBorders,
  rows:[new TableRow({children:[cell(a,L,{right:260,top:0,bottom:0,left:0}),cell(b,R,{left:200,top:0,bottom:0,right:0})]})]});

const doc=new Document({
  styles:{default:{document:{run:{font:SERIF,size:17}}}},
  numbering:{config:[{reference:'bul',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,
    style:{paragraph:{indent:{left:200,hanging:140}}}}]}]},
  sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:576,right:864,bottom:760,left:864}}},
    children:[table(head,contactCell),P([T(' ',{size:8})],{spacing:{before:0,after:80}}),table(left,right)]}],
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('Adam_Kanevsky_CV.docx',b);console.log('docx written',b.length,'bytes')});
