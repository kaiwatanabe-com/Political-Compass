// questions.js
// Controversial merged into Social-Core: only C2 & C4 were non-duplicates; appended to Social.
// Sections: economic (24), social (24 + 2), security (16)

const BANK = [
  {
    key: "economic",
    title: {en: "Economic (X)", ja: "経済（X）"},
    color: "#4da3ff",
    items: [
      ["E1",{en:"Private firms, not the state, should provide most goods and services.",ja:"財・サービスの大半は、国家ではなく民間企業が提供すべきだ。"},false],
      ["E2",{en:"Major utilities (power, water, rail) should be publicly owned.",ja:"主要公益（電力・水道・鉄道など）は公的所有とすべきだ。"},true],
      ["E3",{en:"Lower business taxes generally raise living standards in the long run.",ja:"長期的には、法人課税の軽減はおおむね生活水準を押し上げる。"},false],
      ["E4",{en:"A universal basic income is a necessary foundation for dignity.",ja:"ユニバーサル・ベーシック・インカムは尊厳を支える基盤として必要だ。"},true],
      ["E5",{en:"High incomes should face substantially higher marginal tax rates.",ja:"高所得には、より高い限界税率を適用すべきだ。"},true],
      ["E6",{en:"Free trade agreements benefit the country overall.",ja:"自由貿易協定は総じて自国の利益になる。"},false],
      ["E7",{en:"Government should guarantee universal healthcare as a right.",ja:"政府は医療への普遍的アクセスを権利として保障すべきだ。"},true],
      ["E8",{en:"Minimum-wage laws usually reduce jobs more than they help.",ja:"最低賃金法は、恩恵よりも雇用減の影響をもたらすことが多い。"},false],
      ["E9",{en:"Strong labor unions are essential to protect workers.",ja:"労働者保護には強力な労働組合が不可欠だ。"},true],
      ["E10",{en:"Privatization usually improves efficiency and quality.",ja:"民営化は通常、効率や品質を高める。"},false],
      ["E11",{en:"To reduce inequality, large inheritances should be heavily taxed.",ja:"格差を抑えるため、高額相続には重い課税を課すべきだ。"},true],
      ["E12",{en:"Environmental problems require strict regulation rather than markets.",ja:"環境問題には市場よりも厳格な規制が必要だ。"},true],
      ["E13",{en:"Cutting red tape is more effective than new programs for growth.",ja:"成長促進には、新規事業よりも規制緩和の方が効果的だ。"},false],
      ["E14",{en:"Rent control is necessary where housing is unaffordable.",ja:"住宅が高騰する地域では家賃規制が必要だ。"},true],
      ["E15",{en:"International capital flows should be mostly unrestricted.",ja:"国際資本移動は概ね自由であるべきだ。"},false],
      ["E16",{en:"Strategic industries should be shielded from foreign ownership.",ja:"戦略産業は外国資本から保護すべきだ。"},true],
      ["E17",{en:"Corporate profits mainly reflect value creation, not exploitation.",ja:"企業利益は主として搾取ではなく価値創造を反映している。"},false],
      ["E18",{en:"Public job programs should be used to guarantee full employment.",ja:"完全雇用のため公的雇用創出策を用いるべきだ。"},true],
      ["E19",{en:"Competitive school markets (vouchers/choice) improve outcomes.",ja:"学校の競争（バウチャーや選択制）は成果を改善する。"},false],
      ["E20",{en:"Government should set price caps on essentials during crises.",ja:"危機時には必需品に価格上限を設けるべきだ。"},true],
      ["E21",{en:"Trade unions should have an easier path to collective bargaining.",ja:"労組の団体交渉をより容易にすべきだ。"},true],
      ["E22",{en:"Stockholder interests should take priority over stakeholder goals.",ja:"利害関係者全般よりも株主利益を優先すべきだ。"},false],
      ["E23",{en:"Wealth concentration threatens democracy and must be curbed.",ja:"富の集中は民主主義を脅かすため抑制すべきだ。"},true],
      ["E24",{en:"Carbon pricing is preferable to command-and-control rules.",ja:"カーボンプライシングは規制的手法より望ましい。"},false]
    ]
  },
  {
    key: "social",
    title: {en: "Social-Core (Y-Core)", ja: "社会（Y-Core）"},
    color: "#7affb3",
    items: [
      ["S1",{en:"Adults should be free to live as they wish if they don’t harm others.",ja:"他者に害を与えない限り、大人は望む生き方を自由に選べるべきだ。"},false],
      ["S2",{en:"Maintaining law and order is more important than civil liberties.",ja:"市民的自由よりも治安維持を重視すべきだ。"},true],
      ["S3",{en:"Speech protections should extend to offensive political ideas.",ja:"不快な政治的言論にも表現の自由を及ぼすべきだ。"},false],
      ["S4",{en:"Censorship is sometimes necessary to protect society.",ja:"社会を守るため検閲が必要となる場合がある。"},true],
      ["S5",{en:"Warrantless mass surveillance by the state is unacceptable.",ja:"国家による令状なき大規模監視は認められない。"},false],
      ["S6",{en:"Police powers should be tightly limited by independent oversight.",ja:"警察権は独立監督により厳格に制限されるべきだ。"},false],
      ["S7",{en:"The country needs a strong leader who can bypass the legislature.",ja:"立法府を迂回できる強力な指導者が必要だ。"},true],
      ["S8",{en:"Disruptive but peaceful protests should rarely be restricted.",ja:"平和的だが妨害的な抗議も、原則として制限すべきではない。"},false],
      ["S9",{en:"Immigration should be tightly limited to preserve national identity.",ja:"国民的アイデンティティ維持のため移民を厳しく制限すべきだ。"},true],
      ["S10",{en:"Consenting adults should be free to marry regardless of gender.",ja:"合意する成人は性別に関わらず結婚の自由を有すべきだ。"},false],
      ["S11",{en:"Recreational drug use by adults should be decriminalized.",ja:"成人の娯楽的薬物使用は非犯罪化すべきだ。"},false],
      ["S12",{en:"Harsher sentences are the most effective way to reduce crime.",ja:"厳罰化こそが犯罪抑止の最も有効な手段だ。"},true],
      ["S13",{en:"The state should not regulate private moral behavior.",ja:"国家は私的な道徳行為を規制すべきではない。"},false],
      ["S14",{en:"Public policy should be secular; religion should not determine laws.",ja:"公共政策は世俗的であるべきで、宗教が立法を左右してはならない。"},false],
      ["S15",{en:"Schools should emphasize obedience and patriotic values over debate.",ja:"学校は討論よりも服従と愛国心を重視すべきだ。"},true],
      ["S16",{en:"Government surveillance technology should be strictly constrained.",ja:"政府の監視技術は厳格に制限されるべきだ。"},false],
      ["S17",{en:"Curfews and protest bans are acceptable tools of governance.",ja:"統治手段として夜間外出禁止やデモ禁止は許容される。"},true],
      ["S18",{en:"Individuals should have broad rights to privacy from the state.",ja:"個人は国家から広範なプライバシー権を有すべきだ。"},false],
      ["S19",{en:"Traditional gender roles should be promoted by public policy.",ja:"伝統的な性役割を公共政策で促進すべきだ。"},true],
      ["S20",{en:"Freedom of association includes the right to unpopular groups.",ja:"結社の自由には不人気な団体の権利も含まれる。"},false],
      ["S21",{en:"National security justifies routine monitoring of all communications.",ja:"国家安全保障は通信の常時監視を正当化する。"},true],
      ["S22",{en:"Blasphemy or insult to national symbols should be legal.",ja:"冒涜的表現や国旗等への侮辱も違法とすべきではない。"},false],
      ["S23",{en:"Media should coordinate with government to limit social harm.",ja:"社会的害悪を減らすため、メディアは政府と連携すべきだ。"},true],
      ["S24",{en:"Civil liberties should expand, not contract, during emergencies.",ja:"非常時であっても市民的自由は縮小でなく拡張を目指すべきだ。"},false],
      // Former "Controversial" unique items:
      ["C2",{en:"Government should restrict misinformation even if it limits speech.",ja:"表現が制限されても、政府は誤情報を抑制すべきだ。"},true],
      ["C4",{en:"Blasphemy or insults to national symbols should be illegal.",ja:"冒涜的表現や国旗等への侮辱は違法とすべきだ。"},true]
    ]
  },
  {
    key: "security",
    title: {en: "National-Security (Y-Security)", ja: "安全保障（Y-Security）"},
    color: "#ffd166",
    items: [
      ["NS1",{en:"Alliances and mutual-defense treaties generally make the country safer.",ja:"同盟・相互防衛条約は概ね国の安全を高める。"},false],
      ["NS2",{en:"Military spending should be cut to fund domestic priorities.",ja:"国内優先課題のため国防費を削減すべきだ。"},true],
      ["NS3",{en:"Preemptive strikes can be justified to prevent emerging threats.",ja:"新たな脅威を防ぐため先制攻撃が正当化される場合がある。"},false],
      ["NS4",{en:"The armed forces should rarely be deployed outside national borders.",ja:"軍の国外展開はごく例外的に限るべきだ。"},true],
      ["NS5",{en:"Targeted killing (e.g., high-value terrorist targets) is sometimes necessary.",ja:"高価値目標の精密攻撃（標的殺害）が必要な場合がある。"},false],
      ["NS6",{en:"Intelligence services should not operate abroad except for defensive collection.",ja:"情報機関の海外活動は防御的収集に限るべきだ。"},true],
      ["NS7",{en:"Economic sanctions are an effective alternative to military force.",ja:"経済制裁は武力に代わる有効な手段だ。"},false],
      ["NS8",{en:"Export controls on dual-use tech do more harm than good.",ja:"デュアルユース技術の輸出規制は害が益を上回る。"},true],
      ["NS9",{en:"Conscription should be considered in major national emergencies.",ja:"重大な国家非常時には徴兵制を検討すべきだ。"},false],
      ["NS10",{en:"Defense procurement should prioritize cost savings over capability.",ja:"装備調達では能力よりコスト削減を優先すべきだ。"},true],
      ["NS11",{en:"Cyber operations are legitimate tools of statecraft.",ja:"サイバー作戦は正当な国家運用の手段である。"},false],
      ["NS12",{en:"Domestic deployment of the military for policing should be strictly avoided.",ja:"治安目的での軍の国内投入は厳に避けるべきだ。"},true],
      ["NS13",{en:"Partnering with imperfect regimes can be necessary for security.",ja:"不完全な体制との協力が安全保障上必要な場合がある。"},false],
      ["NS14",{en:"Intelligence sharing with foreign partners creates unacceptable risks.",ja:"対外的な情報共有は受け入れ難いリスクを生む。"},true],
      ["NS15",{en:"Autonomous weapons should be tightly regulated or banned.",ja:"自律型兵器は厳格に規制または禁止すべきだ。"},true],
      ["NS16",{en:"Secrecy constraints on national-security agencies are generally appropriate.",ja:"安全保障機関に対する秘密保持の制約は概ね適切だ。"},false]
    ]
  }
];
