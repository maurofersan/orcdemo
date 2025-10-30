import $ from 'jquery';
import 'jquery-ui/ui/widgets/dialog';

export class ProgressDialog {
  constructor(private message: String, private autoOpen: boolean = false) {
    this._containerElement = $( `<div class="identy_progress_dialog_box">
                    <div class="identy_container">

                        <div class="identy_dialog_state">

                                <div class="custom-spinner pull-left"></div>
                                <div class="custom-spinner-label pull-left">${this.message}</div>
                        </div>

                    </div>
                </div>`);


    this._containerElement.dialog({
      closeOnEscape: false,
      title: "Processing..",
      position: {my: 'center', at: 'center', of: window, collision: 'none'},
      modal: true,
      autoOpen: this.autoOpen,
      classes: {
        "ui-dialog": "identy-ocr-dialog ui-progress-dialog"
      },
      open: (e) => {

        $(e.target).parent().css('position', 'fixed');
        $(this._containerElement).parent().find(".ui-dialog-titlebar").hide();

      },
      close: () => {
        setTimeout(() => {

          this._containerElement.remove();
          this._containerElement = null;

        }, 10);
      }
    });

  }

  private _containerElement;

  destroy() {
    this._containerElement.dialog("destroy");
    this._containerElement.remove();
    this._containerElement = null;
  }

  render() {

  }

  public show() {
    this._containerElement.dialog("open");
  }

  public hide() {
    if (this._containerElement != null) {
      this._containerElement.dialog("close");
    }
  }



}
