// i18n.js
const I18N = {
  en: {
    method_btn: "Method",
    method_intro: "We measured ideology on Economic (X) and Social (Y) axes using a 9-point, 80-item bank (Economic, Social-core, National-security, Civil-liberties) with balanced reverse-keying, randomized interleaving, and two attention checks. Scores used mean-centered indices (−100…+100) and GRM-IRT EAP θ. We evaluated reliability (α/ω), EFA→CFA fit and invariance, and external validity vs SECS, RWA, SDO7, and ESJ. Respondents could skip items.",
    save: "Save", load: "Load", reset: "Reset",
    prev: "Prev", next: "Next", compute: "Compute & Plot",
    x_axis_hint: "Economic (Left −100 ↔ +100 Right)",
    y_axis_hint: "Civil-Liberties (−100 Authoritarian ↔ +100 Libertarian)",
    answered_hint: "Items answered",
    ycore_hint: "Social-Core (incl. C2/C4)", ysec_hint: "National-Security",
    dl_card: "Download Result Card",
    privacy_note: "Answers are stored locally only if you click Save. Reverse-scored items handled automatically.",
    about_title: "About the method", disclaimer: "Indicative mapping only. Use with care.",
    scale_left: "Strongly Disagree", scale_right: "Strongly Agree", scale_neutral: "Neutral",
    section_counts: (a,b)=>`${a}/${b}`
  },
  ja: {
    method_btn: "手法",
    method_intro: "政治的イデオロギーは、経済（X）と社会（Y）の二軸で評価します。9件法80項目（経済・社会コア・国家安全保障・市民的自由）を用い、逆転項目を均衡配置し、項目順は無作為に交錯させ、注意確認を2問含めます。得点は平均中心化して−100～+100に変換し、GRM-IRTのEAP θでも推定します。信頼性（α・ω）、次元性（EFA→CFA）、測定不変性、外的妥当性（SECS・RWA・SDO7・ESJとの関連）を検証します。回答は任意でスキップできます。",
    save: "保存", load: "読込", reset: "リセット",
    prev: "前へ", next: "次へ", compute: "計算とプロット",
    x_axis_hint: "経済（左 −100 ↔ +100 右）",
    y_axis_hint: "市民的自由（−100 権威主義 ↔ +100 自由主義）",
    answered_hint: "回答済み",
    ycore_hint: "社会（C2/C4を含む）", ysec_hint: "安全保障",
    dl_card: "結果カードを保存",
    privacy_note: "保存を押した場合のみ端末に保存。反転項目は自動処理。",
    about_title: "手法について", disclaimer: "参考的な目安です。解釈は慎重に。",
    scale_left: "強い反対", scale_right: "強い賛成", scale_neutral: "中立",
    section_counts: (a,b)=>`${a}/${b}`
  }
};
