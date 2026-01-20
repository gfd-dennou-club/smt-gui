# smt-gui
#### SmT GUI is forked from [smalruby3/smalruby-gui](https://github.com/smalruby/smalruby3-gui). 

## 利用方法・開発方法

[smt-gui wiki](https://github.com/gfd-dennou-club/smt-gui/wiki) をご覧ください．

## 動作検証サイト

https://ceres.epi.it.matsue-ct.ac.jp/smt/

## demonstration

1. 松江高専マイコン基板にて，L チカを実行する例．マイコン基板用のブロックを利用．

https://github.com/user-attachments/assets/dad6f164-4ad9-4464-ab28-cfa6f8ca1160

2. Ruby コードからブロックに変換できることを示す例．[共通 I/O API ガイドライン](https://github.com/mruby/microcontroller-peripheral-interface-guide) に準拠した Ruby コードは変換可能．

https://github.com/user-attachments/assets/702a4bbb-c2df-4cf3-8b4b-8abd0afb0876

3. 各種基板専用のブロックは，逆変換すると，[共通 I/O API ガイドライン](https://github.com/mruby/microcontroller-peripheral-interface-guide) に準拠したブロックへ変換される

https://github.com/user-attachments/assets/cd830869-f9e2-470d-9468-f047a0008bd2

4. 「ステージ」にコメントで Ruby コードを貼り付けておくと，それを合体させたコードが生成される．周辺機器用のクラスを Ruby で自作した場合などに利用できる．

https://github.com/user-attachments/assets/7a1b4d9a-2aa0-4885-9197-ffdffb0ef76c
